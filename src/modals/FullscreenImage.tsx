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
    const touchStartX = React.useRef<number | null>(null)
    const touchStartY = React.useRef<number | null>(null)
    const touchCurrentX = React.useRef<number | null>(null)
    const touchCurrentY = React.useRef<number | null>(null)
    const swiping = React.useRef(false)
    const SWIPE_THRESHOLD = 50

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
            onTouchStart={(e) => {
                const t = e.touches[0]
                touchStartX.current = t.clientX
                touchStartY.current = t.clientY
                touchCurrentX.current = t.clientX
                touchCurrentY.current = t.clientY
                swiping.current = false
            }}
            onTouchMove={(e) => {
                const t = e.touches[0]
                touchCurrentX.current = t.clientX
                touchCurrentY.current = t.clientY
                const dx = (touchCurrentX.current || 0) - (touchStartX.current || 0)
                const dy = (touchCurrentY.current || 0) - (touchStartY.current || 0)
                // if horizontal movement dominates and exceeds small threshold, mark as swiping
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
                    swiping.current = true
                    // prevent vertical page scroll while swiping horizontally
                    e.preventDefault()
                }
            }}
            onTouchEnd={(e) => {
                if (!swiping.current) return
                const dx = (touchCurrentX.current || 0) - (touchStartX.current || 0)
                if (dx > SWIPE_THRESHOLD) {
                    onPrev()
                } else if (dx < -SWIPE_THRESHOLD) {
                    onNext()
                }
                touchStartX.current = null
                touchStartY.current = null
                touchCurrentX.current = null
                touchCurrentY.current = null
                swiping.current = false
            }}
        >
            <div className="min-h-screen flex items-center justify-center px-4">
                <img
                    src={src}
                    alt={alt || ''}
                    onClick={(e) => {
                        // if we were swiping, don't treat as a tap
                        if (swiping.current) return
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
