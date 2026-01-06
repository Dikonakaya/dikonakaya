/**
 * useLineReveal Hook
 * 
 * A custom React hook that triggers a reveal animation when an element
 * enters the viewport. Uses the Intersection Observer API.
 * 
 * Features:
 * - One-time reveal (doesn't re-trigger on scroll back)
 * - Configurable threshold (default 10% visibility)
 * - Returns ref to attach and revealed boolean for CSS classes
 * 
 * Usage:
 * const { ref, revealed } = useLineReveal()
 * <div ref={ref} className={revealed ? 'visible' : 'hidden'}>
 * 
 * @author Dikonakaya
 */

import { useEffect, useRef, useState } from 'react'

export default function useLineReveal() {
    const ref = useRef<HTMLDivElement | null>(null)
    const [revealed, setRevealed] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setRevealed(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return { ref, revealed }
}
