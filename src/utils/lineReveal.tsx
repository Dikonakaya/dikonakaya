import { useEffect, useRef, useState } from 'react'

// Simple intersection-based reveal hook.
// Reverted to non-persistent behavior: the revealed flag is set the first time
// the element intersects and the observer is disconnected. This plays the
// animation once per component mount (no session/local storage persistence).
export default function lineReveal(_key?: string) {
    const ref = useRef<HTMLDivElement | null>(null)
    const [revealed, setRevealed] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        let observer: IntersectionObserver | null = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setRevealed(true)
                    if (observer) observer.disconnect()
                    observer = null
                    break
                }
            }
        }, { threshold: 0.1 })

        observer.observe(el)

        return () => {
            if (observer) observer.disconnect()
            observer = null
        }
    }, [])

    return { ref, revealed }
}
