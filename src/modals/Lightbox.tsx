import { useRef, useState, useEffect, type TouchEvent as ReactTouchEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FullscreenImage from './FullscreenImage'

const MDiv = motion.div as any
const MImg = motion.img as any

type LightboxImage = {
    resizedSrc?: string
    title?: string
    description?: string
    other?: string
    tags?: string[]
}

type Props = {
    images: Array<LightboxImage | null>
    index: number | null
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}

const SWIPE_THRESHOLD = 50

export default function Lightbox({ images, index, onClose, onNext, onPrev }: Props) {
    const img = index !== null ? images[index] || null : null
    const openedAtRef = useRef(0)
    const touchStartX = useRef<number | null>(null)
    const touchCurrentX = useRef<number | null>(null)
    const [fullscreenOpen, setFullscreenOpen] = useState(false)

    const openFullscreen = () => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setFullscreenOpen(true)
        }
    }

    // Track when lightbox opened (prevent accidental fullscreen on open)
    useEffect(() => {
        if (index !== null) openedAtRef.current = Date.now()
    }, [index])

    // Keyboard navigation
    useEffect(() => {
        if (index === null) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { if (fullscreenOpen) setFullscreenOpen(false); else onClose() }
            else if (e.key === 'ArrowRight') onNext()
            else if (e.key === 'ArrowLeft') onPrev()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [index, fullscreenOpen, onClose, onNext, onPrev])

    // Handle browser back button
    useEffect(() => {
        const pushedRef = { current: false }
        const onPop = () => {
            if (!pushedRef.current) return
            if (fullscreenOpen) {
                setFullscreenOpen(false)
            } else {
                onClose()
            }
            pushedRef.current = false
        }

        if (index !== null) {
            try { window.history.pushState({ lightbox: true }, ''); pushedRef.current = true } catch { }
        }

        window.addEventListener('popstate', onPop)
        return () => {
            window.removeEventListener('popstate', onPop)
            try {
                if (pushedRef.current && window.history.state?.lightbox) {
                    window.history.replaceState(null, '', window.location.href)
                }
            } catch { }
        }
    }, [index, fullscreenOpen, onClose])

    const handleSwipe = (action: 'start' | 'move' | 'end', e?: ReactTouchEvent) => {
        if (action === 'start' && e) {
            touchStartX.current = e.touches[0].clientX
            touchCurrentX.current = e.touches[0].clientX
        } else if (action === 'move' && e) {
            touchCurrentX.current = e.touches[0].clientX
        } else if (action === 'end') {
            if (touchStartX.current != null && touchCurrentX.current != null) {
                const dx = touchCurrentX.current - touchStartX.current
                if (dx > SWIPE_THRESHOLD) onPrev()
                else if (dx < -SWIPE_THRESHOLD) onNext()
            }
            touchStartX.current = null
            touchCurrentX.current = null
        }
    }

    const handleImageClick = () => {
        if (Date.now() - openedAtRef.current > 200) openFullscreen()
    }

    const btnClass = 'text-white bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-transform duration-200 ease-out hover:scale-110'

    return (
        <AnimatePresence>
            {index !== null && (
                <MDiv
                    key="lightbox-root"
                    className="fixed inset-0 z-50 flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    {/* Dark backdrop (visual only — click bubbles to MDiv above) */}
                    <div className="absolute inset-0 bg-black/90 pointer-events-none" />

                    {/* Mobile close button — top-left, vertically aligned with ‹ arrow */}
                    {!fullscreenOpen && (
                        <button
                            onClick={(e: ReactMouseEvent) => { e.stopPropagation(); onClose() }}
                            className={`lg:hidden absolute top-4 left-3 z-20 w-9 h-10 ${btnClass}`}
                            aria-label="Close"
                        >✕</button>
                    )}

                    {/* Main layout: full-screen on mobile, image+panel on desktop */}
                    <div className="relative flex flex-col lg:flex-row w-full h-full">
                        {/* ── Image area ── */}
                        <div
                            className="relative flex-1 min-h-0"
                            onTouchStart={(e) => handleSwipe('start', e)}
                            onTouchMove={(e) => handleSwipe('move', e)}
                            onTouchEnd={() => handleSwipe('end')}
                        >
                            {/* No padding on mobile; padding on desktop */}
                            <div className="absolute inset-0 flex items-center justify-center lg:p-14">
                                <AnimatePresence mode="wait">
                                    {img && (
                                        <MImg
                                            key={img.resizedSrc || index}
                                            src={img.resizedSrc || ''}
                                            alt={img.title || ''}
                                            onClick={(e: ReactMouseEvent) => { e.stopPropagation(); handleImageClick() }}
                                            className="max-w-full max-h-full object-contain rounded-sm lg:cursor-zoom-in select-none"
                                            initial={{ opacity: 0, scale: 0.99 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.05 }}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile info overlay — bottom of image area */}
                            <div className="lg:hidden absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/75 to-transparent px-4 pb-5 pt-12 pointer-events-none">
                                {img?.title && <h2 className="text-base font-semibold text-white leading-snug">{img.title}</h2>}
                                {img?.description && <p className="text-xs text-white/70 mt-1 leading-relaxed">{img.description}</p>}
                                {img?.other && <p className="text-xs text-white/60 mt-1">{img.other}</p>}
                            </div>

                            {/* Prev / Next arrows */}
                            {!fullscreenOpen && (
                                <>
                                    <button
                                        onClick={(e: ReactMouseEvent) => { e.stopPropagation(); onPrev() }}
                                        aria-label="Previous"
                                        className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-10 ${btnClass}`}
                                    >‹</button>
                                    <button
                                        onClick={(e: ReactMouseEvent) => { e.stopPropagation(); onNext() }}
                                        aria-label="Next"
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-10 ${btnClass}`}
                                    >›</button>
                                </>
                            )}
                        </div>

                        {/* ── Details panel — desktop only ── */}
                        <div
                            className="hidden lg:flex shrink-0 lg:w-72 xl:w-80 bg-[#1E1E25] text-white flex-col border-l border-white/10"
                            onClick={(e: ReactMouseEvent) => e.stopPropagation()}
                        >
                            {/* Panel header: counter + actions */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
                                <span className="text-xs text-white/40 select-none tabular-nums">
                                    {index !== null ? `${index + 1} / ${images.length}` : ''}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e: ReactMouseEvent) => { e.stopPropagation(); handleImageClick() }}
                                        className={`flex w-8 h-8 ${btnClass}`}
                                        aria-label="Open fullscreen"
                                    >⛶</button>
                                    <button
                                        onClick={(e: ReactMouseEvent) => { e.stopPropagation(); onClose() }}
                                        className={`w-8 h-8 ${btnClass}`}
                                        aria-label="Close"
                                    >✕</button>
                                </div>
                            </div>

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                                {img?.title && (
                                    <h2 className="text-lg font-semibold leading-snug">{img.title}</h2>
                                )}
                                {img?.description && (
                                    <p className="text-sm text-white/70 leading-relaxed">{img.description}</p>
                                )}
                                {img?.other && (
                                    <p className="text-sm text-white/60">{img.other}</p>
                                )}
                                {img?.tags?.length ? (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {img.tags.map((t) => (
                                            <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded">{t}</span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {fullscreenOpen && img && (
                        <FullscreenImage
                            src={img.resizedSrc || ''}
                            alt={img.title}
                            onClose={() => setFullscreenOpen(false)}
                            onNext={onNext}
                            onPrev={onPrev}
                        />
                    )}
                </MDiv>
            )}
        </AnimatePresence>
    )
}
