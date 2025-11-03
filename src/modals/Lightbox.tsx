import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

    const raf = () => new Promise((res) => requestAnimationFrame(res))

    useLayoutEffect(() => {
        if (!bottomRef.current) return
        let mounted = true
        const adjust = async () => {
            if (!mounted || !bottomRef.current) return
            setShowDescription(true)
            setShowTitle(true)
            await raf()

            if (!mounted || !bottomRef.current) return
            const el = bottomRef.current
            const TOL = 8 // small tolerance in pixels to avoid over-sensitive hiding
            if (el.scrollHeight <= el.clientHeight + TOL) return

            setShowDescription(false)
            await raf()
            if (!mounted || !bottomRef.current) return
            if (el.scrollHeight <= el.clientHeight + TOL) return

            setShowTitle(false)
        }

        adjust()
        const onResize = () => adjust()
        window.addEventListener('resize', onResize)
        return () => {
            mounted = false
            window.removeEventListener('resize', onResize)
        }
    }, [index, img?.title, img?.description, img?.other, (img?.tags || []).length])


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
                        <button
                            onClick={onClose}
                            onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                            className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full w-9 h-9 flex items-center justify-center z-50 transform transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
                            aria-label="Close lightbox"
                        >
                            ✕
                        </button>

                        <div className="relative xl:w-[900px] xl:h-[600px] xl:min-h-[600px] xl:max-h-[600px] lg:w-[700px] lg:h-[440px] lg:min-h-[440px] lg:max-h-[440px] md:w-[640px] md:h-[420px] md:min-h-[420px] md:max-h-[420px] sm:w-[480px] sm:h-[320px] sm:min-h-[320px] sm:max-h-[320px] w-[320px] h-[200px] min-h-[200px] max-h-[200px] max-w-full flex items-center justify-center px-6 py-6">
                            <button
                                onClick={onPrev}
                                onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                aria-label="Previous image"
                                className="absolute top-1/2 -translate-y-1/2 rounded-full w-6 h-10 flex items-center justify-center z-50 group left-4 md:left-8 lg:-left-4 xl:-left-4"
                            >
                                <span className="text-white bg-black/40 group-hover:bg-black/60 group-focus-visible:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transform transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-focus-visible:-translate-y-1 group-focus-visible:scale-105">‹</span>
                            </button>

                            <MImg
                                src={img?.resizedSrc || ''}
                                alt={img?.title || ''}
                                className="w-full h-full object-contain rounded-md"
                                initial={{ opacity: 0.98, scale: 0.99, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                                transition={{ duration: 0.22 }}
                            />

                            <button
                                onClick={onNext}
                                onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                                aria-label="Next image"
                                className="absolute top-1/2 -translate-y-1/2 rounded-full w-6 h-10 flex items-center justify-center z-50 group right-4 md:right-8 lg:-right-4 xl:-right-4"
                            >
                                <span className="text-white bg-black/40 group-hover:bg-black/60 group-focus-visible:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transform transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-focus-visible:-translate-y-1 group-focus-visible:scale-105">›</span>
                            </button>
                        </div>

                        <div ref={bottomRef} className="w-full mt-4 p-6 bg-[#1E1E25] rounded-b-md text-white text-center overflow-hidden xl:h-[160px] xl:min-h-[160px] xl:max-h-[160px] lg:h-[140px] lg:min-h-[140px] lg:max-h-[140px] md:h-[140px] md:min-h-[140px] md:max-h-[140px] sm:h-[120px] sm:min-h-[120px] sm:max-h-[120px] h-[120px] min-h-[120px] max-h-[120px] flex flex-col items-center justify-center space-y-2">
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
                    </MDiv>
                </MDiv>
            )}
        </AnimatePresence>
    )
}
