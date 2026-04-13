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
