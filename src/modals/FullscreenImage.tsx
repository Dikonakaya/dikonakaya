import React, { useEffect, useState } from 'react'

type Props = {
    src: string
    alt?: string
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}

export default function FullscreenImage({ src, alt, onClose, onNext, onPrev }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                try {
                    e.preventDefault()
                        ; (e as any).stopImmediatePropagation?.()
                    e.stopPropagation()
                } catch (err) {

                }
                onClose()
                return
            } else if (e.key === 'ArrowRight') {
                try {
                    e.preventDefault()
                        ; (e as any).stopImmediatePropagation?.()
                    e.stopPropagation()
                } catch (err) {

                }
                onNext()
            } else if (e.key === 'ArrowLeft') {
                try {
                    e.preventDefault()
                        ; (e as any).stopImmediatePropagation?.()
                    e.stopPropagation()
                } catch (err) {

                }
                onPrev()
            }
        }

        const onPop = (e: PopStateEvent) => {
            try {
                ; (e as any).stopImmediatePropagation?.()
                e.stopPropagation()
            } catch (err) {

            }
            onClose()
        }

        try {
            window.history.pushState({ fullscreen: true }, '')
        } catch (err) {

        }

        window.addEventListener('keydown', onKey, true)
        window.addEventListener('popstate', onPop)
        return () => {
            window.removeEventListener('keydown', onKey, true)
            window.removeEventListener('popstate', onPop)
            try {
                if (window.history.state && (window.history.state as any).fullscreen) {
                    window.history.replaceState(null, '', window.location.href)
                }
            } catch (err) {

            }
        }
    }, [onClose, onNext, onPrev])
    const [fitWidth, setFitWidth] = useState(false)

    const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const t = e.target as HTMLElement
        if (t && t.tagName === 'IMG') return
        e.stopPropagation()
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-60 bg-black overflow-auto"
            onClick={onOverlayClick}
            aria-hidden={false}
            role="dialog"
        >
            <div className="min-h-screen flex items-center justify-center px-4">
                <img
                    src={src}
                    alt={alt || ''}
                    onClick={(e) => {
                        e.stopPropagation()
                        setFitWidth((v) => !v)
                    }}
                    className={`object-contain ${fitWidth ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    style={fitWidth ? { width: '100vw', height: 'auto', maxWidth: '100vw', background: 'black', display: 'block', margin: '0 auto' } : { height: '100vh', width: 'auto', maxHeight: '100vh', background: 'black', display: 'block', margin: '0 auto' }}
                />
            </div>
        </div>
    )
}
