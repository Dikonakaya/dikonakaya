import { useEffect, useState, useRef, type TouchEvent as ReactTouchEvent } from 'react'

type Props = {
    src: string
    alt?: string
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}

const SWIPE_THRESHOLD = 50

export default function FullscreenImage({ src, alt, onClose, onNext, onPrev }: Props) {
    const [fitWidth, setFitWidth] = useState(false)
    const touchStart = useRef({ x: 0, y: 0 })
    const touchCurrent = useRef({ x: 0, y: 0 })
    const swiping = useRef(false)

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.key === 'Escape') onClose()
            else if (e.key === 'ArrowRight') onNext()
            else if (e.key === 'ArrowLeft') onPrev()
        }

        const onPop = () => onClose()

        try { window.history.pushState({ fullscreen: true }, '') } catch { }
        window.addEventListener('keydown', onKey, true)
        window.addEventListener('popstate', onPop)

        return () => {
            window.removeEventListener('keydown', onKey, true)
            window.removeEventListener('popstate', onPop)
            try {
                if (window.history.state?.fullscreen) {
                    window.history.replaceState(null, '', window.location.href)
                }
            } catch { }
        }
    }, [onClose, onNext, onPrev])

    const handleTouchStart = (e: ReactTouchEvent) => {
        const t = e.touches[0]
        touchStart.current = { x: t.clientX, y: t.clientY }
        touchCurrent.current = { x: t.clientX, y: t.clientY }
        swiping.current = false
    }

    const handleTouchMove = (e: ReactTouchEvent) => {
        const t = e.touches[0]
        touchCurrent.current = { x: t.clientX, y: t.clientY }
        const dx = touchCurrent.current.x - touchStart.current.x
        const dy = touchCurrent.current.y - touchStart.current.y
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
            swiping.current = true
            e.preventDefault()
        }
    }

    const handleTouchEnd = () => {
        if (!swiping.current) return
        const dx = touchCurrent.current.x - touchStart.current.x
        if (dx > SWIPE_THRESHOLD) onPrev()
        else if (dx < -SWIPE_THRESHOLD) onNext()
        swiping.current = false
    }

    const imageStyle = fitWidth
        ? { width: '100vw', height: 'auto', maxWidth: '100vw', background: 'black', display: 'block', margin: '0 auto' }
        : { height: '100vh', width: 'auto', maxHeight: '100vh', background: 'black', display: 'block', margin: '0 auto' }

    return (
        <div
            className="fixed inset-0 z-60 bg-black overflow-auto"
            onClick={(e) => (e.target as HTMLElement).tagName !== 'IMG' && onClose()}
            role="dialog"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="min-h-screen flex items-center justify-center px-4">
                <img
                    src={src}
                    alt={alt || ''}
                    onClick={(e) => { if (!swiping.current) { e.stopPropagation(); setFitWidth(v => !v) } }}
                    className={`object-contain ${fitWidth ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    style={imageStyle}
                />
            </div>
        </div>
    )
}
