import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Use any-casted aliases to avoid strict motion prop typing issues in this repo
const MDiv: any = motion.div
const MImg: any = motion.img

type LightboxImage = {
    resizedSrc?: string
    title?: string
    description?: string
    camera?: string
    lens?: string
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
                    {/* backdrop */}
                    <MDiv
                        className="absolute inset-0 bg-black/30"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* modal */}
                    <MDiv
                        className="relative flex flex-col items-center p-8 bg-[#373944] shadow-md rounded-md max-w-[1600px] w-full mx-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-50"
                            aria-label="Close lightbox"
                        >
                            ✕
                        </button>

                        <div className="relative w-[900px] h-[600px] max-w-full max-h-[80vh] flex items-center justify-center">
                            <button
                                onClick={onPrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 z-50"
                                aria-label="Previous image"
                            >
                                ‹
                            </button>

                            {/* image animation: include opacity + slight y move so exit feels distinct */}
                            <MImg
                                src={img?.resizedSrc || ''}
                                alt={img?.title || ''}
                                className="max-w-full max-h-full object-contain rounded-md"
                                initial={{ opacity: 0.98, scale: 0.99, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                                transition={{ duration: 0.22 }}
                            />

                            <button
                                onClick={onNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-3 z-50"
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </div>

                        <div className="w-full text-white mt-4">
                            <h2 className="text-xl font-semibold">{img?.title}</h2>
                            <p className="text-sm mt-1">{img?.description}</p>
                            <div className="mt-2 text-sm">
                                <strong>Camera:</strong> {img?.camera || '—'} &nbsp; • &nbsp;
                                <strong>Lens:</strong> {img?.lens || '—'}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
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
