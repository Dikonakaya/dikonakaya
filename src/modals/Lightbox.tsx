import React, { useLayoutEffect, useRef, useState, useEffect } from 'react'
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
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const openedAtRef = useRef(0)
    const touchStartX = useRef<number | null>(null)
    const touchCurrentX = useRef<number | null>(null)

    const [showDescription, setShowDescription] = useState(true)
    const [showTitle, setShowTitle] = useState(true)
    const [bottomVisible, setBottomVisible] = useState(false)
    const [fullscreenOpen, setFullscreenOpen] = useState(false)

    const openFullscreen = () => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setFullscreenOpen(true)
        }
    }

    // Measure and adjust bottom panel visibility
    useLayoutEffect(() => {
        if (!bottomRef.current) return
        let mounted = true

        const measure = (showDesc: boolean, showTitleLocal: boolean) => {
            const el = bottomRef.current!
            const wrapper = document.createElement('div')
            wrapper.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;'
            wrapper.style.width = `${el.clientWidth}px`
            wrapper.className = el.className

            if (showTitleLocal && img?.title) {
                const h = document.createElement('h2')
                h.className = 'text-xl font-semibold m-0'
                h.textContent = img.title
                wrapper.appendChild(h)
            }
            if (showDesc && img?.description) {
                const p = document.createElement('p')
                p.className = 'text-sm m-0'
                p.textContent = img.description
                wrapper.appendChild(p)
            }
            if (img?.other) {
                const other = document.createElement('p')
                other.className = 'text-sm m-0'
                other.textContent = img.other
                wrapper.appendChild(other)
            }
            if (img?.tags?.length) {
                const tagWrap = document.createElement('div')
                tagWrap.className = 'flex flex-wrap gap-2 justify-center'
                img.tags.forEach((t) => {
                    const s = document.createElement('span')
                    s.className = 'text-xs bg-white/10 px-2 py-1 rounded'
                    s.textContent = t
                    tagWrap.appendChild(s)
                })
                wrapper.appendChild(tagWrap)
            }

            document.body.appendChild(wrapper)
            const h = wrapper.scrollHeight
            document.body.removeChild(wrapper)
            return h
        }

        const adjust = () => {
            if (!mounted || !bottomRef.current) return
            setBottomVisible(false)

            // On small screens, always show everything
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setShowDescription(true)
                setShowTitle(true)
                setBottomVisible(true)
                return
            }

            const el = bottomRef.current
            const TOL = 8
            const clientH = el.clientHeight

            if (measure(true, true) <= clientH + TOL) {
                setShowDescription(true)
                setShowTitle(true)
            } else if (measure(false, true) <= clientH + TOL) {
                setShowDescription(false)
                setShowTitle(true)
            } else {
                setShowDescription(false)
                setShowTitle(false)
            }
            setBottomVisible(true)
        }

        adjust()
        window.addEventListener('resize', adjust)
        return () => { mounted = false; window.removeEventListener('resize', adjust) }
    }, [index, img?.title, img?.description, img?.other, img?.tags?.length])

    // Track when lightbox opened
    useEffect(() => {
        if (index !== null) openedAtRef.current = Date.now()
    }, [index])

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

    const handleSwipe = (action: 'start' | 'move' | 'end', e?: React.TouchEvent) => {
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

    const btnClass = 'text-white bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-105'

    return (
        <AnimatePresence>
            {index !== null && (
                <MDiv
                    key="lightbox-root"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <MDiv className="absolute inset-0 bg-black/30" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

                    <MDiv
                        className="relative flex flex-col items-center bg-[#373944] shadow-md rounded-md w-full mx-0 sm:mx-4 sm:max-w-[80vw] sm:max-h-[80vh] max-w-[100vw] max-h-[100vh] overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        {/* Top controls */}
                        {!fullscreenOpen && (
                            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                                <button onClick={handleImageClick} className={`hidden lg:flex w-9 h-9 ${btnClass}`} aria-label="Open fullscreen">⛶</button>
                                <button onClick={onClose} className={`w-9 h-9 ${btnClass}`} aria-label="Close">✕</button>
                            </div>
                        )}

                        {/* Image container */}
                        <div
                            className="relative 3xl:w-[1200px] 3xl:h-[800px] 2xl:w-[820px] 2xl:h-[540px] xl:w-[820px] xl:h-[540px] lg:w-[640px] lg:h-[420px] md:w-[640px] md:h-[420px] sm:w-[480px] sm:h-[320px] w-[90vw] max-w-full flex items-center justify-center sm:px-6 sm:py-6 px-2 py-4"
                            onTouchStart={(e) => handleSwipe('start', e)}
                            onTouchMove={(e) => handleSwipe('move', e)}
                            onTouchEnd={() => handleSwipe('end')}
                        >
                            {!fullscreenOpen && (
                                <button onClick={onPrev} aria-label="Previous" className="absolute top-1/2 -translate-y-1/2 z-50 group left-4 md:left-8 lg:-left-4">
                                    <span className={`w-6 h-10 ${btnClass}`}>‹</span>
                                </button>
                            )}

                            <AnimatePresence mode="wait">
                                {img && (
                                    <MImg
                                        key={img.resizedSrc || index}
                                        src={img.resizedSrc || ''}
                                        alt={img.title || ''}
                                        onClick={handleImageClick}
                                        className="w-full h-full object-contain rounded-md"
                                        initial={{ opacity: 0, scale: 0.99 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.05 }}
                                    />
                                )}
                            </AnimatePresence>

                            {!fullscreenOpen && (
                                <button onClick={onNext} aria-label="Next" className="absolute top-1/2 -translate-y-1/2 z-50 group right-4 md:right-8 lg:-right-4">
                                    <span className={`w-6 h-10 ${btnClass}`}>›</span>
                                </button>
                            )}
                        </div>

                        {/* Bottom info panel */}
                        <div
                            ref={bottomRef}
                            className={`w-full mt-6 px-6 py-6 sm:px-8 sm:py-5 bg-[#1E1E25] rounded-b-md text-white text-center overflow-hidden xl:h-[160px] lg:h-[140px] md:h-[140px] sm:h-[140px] h-[160px] flex flex-col items-center justify-center space-y-2 transition-opacity duration-150 ${bottomVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            {showTitle && <h2 className="text-xl font-semibold m-0">{img?.title}</h2>}
                            {showDescription && <p className="text-sm m-0">{img?.description}</p>}
                            {img?.other && <p className="text-sm m-0">{img.other}</p>}
                            {img?.tags?.length && (
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {img.tags.map((t) => <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded">{t}</span>)}
                                </div>
                            )}
                        </div>

                        {fullscreenOpen && img && (
                            <FullscreenImage src={img.resizedSrc || ''} alt={img.title} onClose={() => setFullscreenOpen(false)} onNext={onNext} onPrev={onPrev} />
                        )}
                    </MDiv>
                </MDiv>
            )}
        </AnimatePresence>
    )
}
