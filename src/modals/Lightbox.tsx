import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FullscreenImage from './FullscreenImage'

const MDiv: any = motion.div
const MImg: any = motion.img

type LightboxImage = {
    resizedSrc?: string
    title?: string
    description?: string
    other?: string
    location?: string
    date?: string
    tags?: string[]
}

type Props = {
    images: Array<LightboxImage | null>
    index: number | null
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}

export default function Lightbox({ images, index, onClose, onNext, onPrev }: Props) {
    const img = index !== null ? images[index] || null : null
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const [showDescription, setShowDescription] = useState(true)
    const [showTitle, setShowTitle] = useState(true)
    const [bottomVisible, setBottomVisible] = useState(false)
    const [fullscreenOpen, setFullscreenOpen] = useState(false)
    const openedAtRef = useRef<number>(0)

    const openFullscreen = () => {
        setFullscreenOpen(true)
    }

    const closeFullscreen = () => {
        setFullscreenOpen(false)
    }

    const touchStartX = useRef<number | null>(null)
    const touchCurrentX = useRef<number | null>(null)
    const SWIPE_THRESHOLD = 50

    useLayoutEffect(() => {
        if (!bottomRef.current) return
        let mounted = true
        const adjust = () => {
            if (!mounted || !bottomRef.current) return
            setBottomVisible(false)
            const el = bottomRef.current!
            const TOL = 8 // small tolerance in pixels to avoid over-sensitive hiding

            const measure = (showDesc: boolean, showTitleLocal: boolean) => {
                const wrapper = document.createElement('div')
                wrapper.style.position = 'absolute'
                wrapper.style.left = '-9999px'
                wrapper.style.top = '0'
                wrapper.style.visibility = 'hidden'
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

                if (img?.tags && img.tags.length) {
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

            const clientH = el.clientHeight
            if (measure(true, true) <= clientH + TOL) {
                setShowDescription(true)
                setShowTitle(true)
                setBottomVisible(true)
                return
            }

            if (measure(false, true) <= clientH + TOL) {
                setShowDescription(false)
                setShowTitle(true)
                setBottomVisible(true)
                return
            }

            setShowDescription(false)
            setShowTitle(false)
            setBottomVisible(true)
        }

        adjust()
        const onResize = () => adjust()
        window.addEventListener('resize', onResize)
        return () => {
            mounted = false
            window.removeEventListener('resize', onResize)
        }
    }, [index, img?.title, img?.description, img?.other, (img?.tags || []).length])

    React.useEffect(() => {
        if (index !== null) {
            openedAtRef.current = Date.now()
        }
    }, [index])

    React.useEffect(() => {
        const pushedRef = { current: false }
        const onPop = (e: PopStateEvent) => {
            // only handle popstate if we know we pushed a state for the lightbox
            if (!pushedRef.current) return
            try {
                ; (e as any).stopImmediatePropagation?.()
                e.stopPropagation()
            } catch (err) {

            }
            // If fullscreen is open, close that first; otherwise close the lightbox
            if (fullscreenOpen) {
                setFullscreenOpen(false)
                // mark handled so subsequent pop isn't treated again
                pushedRef.current = false
                return
            }
            pushedRef.current = false
            onClose()
        }

        if (index !== null) {
            try {
                window.history.pushState({ lightbox: true }, '')
                pushedRef.current = true
            } catch (err) {

            }
        }

        window.addEventListener('popstate', onPop)
        return () => {
            window.removeEventListener('popstate', onPop)
            try {
                if (pushedRef.current && window.history.state && (window.history.state as any).lightbox) {
                    window.history.replaceState(null, '', window.location.href)
                }
            } catch (err) {

            }
        }
    }, [index, fullscreenOpen, onClose])


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
                    <MDiv
                        className="absolute inset-0 bg-black/30"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <MDiv
                        className="relative flex flex-col items-center bg-[#373944] shadow-md rounded-md w-full mx-4 max-w-[80vw] max-h-[80vh] overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                    >
                        {!fullscreenOpen && (
                            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const age = Date.now() - (openedAtRef.current || 0)
                                        if (age < 200) return
                                        openFullscreen()
                                    }}
                                    onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                    className="text-white bg-black/40 hover:bg-black/60 rounded-full w-9 h-9 flex items-center justify-center transform transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
                                    aria-label="Open image in full screen"
                                >
                                    ⛶
                                </button>

                                <button
                                    onClick={onClose}
                                    onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                    className="text-white bg-black/40 hover:bg-black/60 rounded-full w-9 h-9 flex items-center justify-center transform transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
                                    aria-label="Close lightbox"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <div
                            className="relative 3xl:w-[1200px] 3xl:h-[800px] 3xl:min-h-[800px] 3xl:max-h-[800px] 2xl:w-[820px] 2xl:h-[540px] 2xl:min-h-[540px] 2xl:max-h-[540px] xl:w-[820px] xl:h-[540px] xl:min-h-[540px] xl:max-h-[540px] lg:w-[640px] lg:h-[420px] lg:min-h-[420px] lg:max-h-[420px] md:w-[640px] md:h-[420px] md:min-h-[420px] md:max-h-[420px] sm:w-[480px] sm:h-[320px] sm:min-h-[320px] sm:max-h-[320px] w-[320px] h-[200px] min-h-[200px] max-h-[200px] max-w-full flex items-center justify-center px-6 pb-6 pt-10"
                            onTouchStart={(e) => {
                                const t = e.touches[0]
                                touchStartX.current = t.clientX
                                touchCurrentX.current = t.clientX
                            }}
                            onTouchMove={(e) => {
                                const t = e.touches[0]
                                touchCurrentX.current = t.clientX
                            }}
                            onTouchEnd={() => {
                                if (touchStartX.current == null || touchCurrentX.current == null) {
                                    touchStartX.current = null
                                    touchCurrentX.current = null
                                    return
                                }
                                const dx = touchCurrentX.current - touchStartX.current
                                if (dx > SWIPE_THRESHOLD) {
                                    onPrev()
                                } else if (dx < -SWIPE_THRESHOLD) {
                                    onNext()
                                }
                                touchStartX.current = null
                                touchCurrentX.current = null
                            }}
                        >
                            {!fullscreenOpen && (
                                <button
                                    onClick={onPrev}
                                    onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                    aria-label="Previous image"
                                    className="absolute top-1/2 -translate-y-1/2 rounded-full w-6 h-10 flex items-center justify-center z-50 group left-4 md:left-8 lg:-left-4 xl:-left-4"
                                >
                                    <span className="text-white bg-black/40 group-hover:bg-black/60 group-focus-visible:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transform transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-focus-visible:-translate-y-1 group-focus-visible:scale-105">‹</span>
                                </button>
                            )}

                            <AnimatePresence mode="wait">
                                {img && (
                                    <MImg
                                        key={img.resizedSrc || index || 'img'}
                                        src={img?.resizedSrc || ''}
                                        alt={img?.title || ''}
                                        onClick={() => {
                                            const age = Date.now() - (openedAtRef.current || 0)
                                            if (age < 200) return
                                            openFullscreen()
                                        }}
                                        className="w-full h-full object-contain rounded-md"
                                        initial={{ opacity: 0, scale: 0.99 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ opacity: { duration: 0.05 }, scale: { duration: 0.05 } }}
                                    />
                                )}
                            </AnimatePresence>

                            {!fullscreenOpen && (
                                <button
                                    onClick={onNext}
                                    onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                    aria-label="Next image"
                                    className="absolute top-1/2 -translate-y-1/2 rounded-full w-6 h-10 flex items-center justify-center z-50 group right-4 md:right-8 lg:-right-4 xl:-right-4"
                                >
                                    <span className="text-white bg-black/40 group-hover:bg-black/60 group-focus-visible:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transform transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-focus-visible:-translate-y-1 group-focus-visible:scale-105">›</span>
                                </button>
                            )}
                        </div>

                        <div ref={bottomRef} className={`w-full mt-4 p-6 bg-[#1E1E25] rounded-b-md text-white text-center overflow-hidden xl:h-[160px] xl:min-h-[160px] xl:max-h-[160px] lg:h-[140px] lg:min-h-[140px] lg:max-h-[140px] md:h-[140px] md:min-h-[140px] md:max-h-[140px] sm:h-[120px] sm:min-h-[120px] sm:max-h-[120px] h-[120px] min-h-[120px] max-h-[120px] flex flex-col items-center justify-center space-y-2 transition-opacity duration-150 ${bottomVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {showTitle && <h2 className="text-xl font-semibold m-0">{img?.title}</h2>}
                            {showDescription && <p className="text-sm m-0">{img?.description}</p>}
                            <div className="text-sm">
                                <p className="text-sm m-0">{img?.other}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {(img?.tags || []).map((t: string) => (
                                    <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {fullscreenOpen && img && (
                            <FullscreenImage
                                src={img.resizedSrc || ''}
                                alt={img?.title}
                                onClose={() => closeFullscreen()}
                                onNext={onNext}
                                onPrev={onPrev}
                            />
                        )}
                    </MDiv>
                </MDiv>
            )}
        </AnimatePresence>
    )
}
