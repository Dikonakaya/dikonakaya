import { useEffect, useRef, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'
import type { PhotoSet } from './types/portfolio'

// Scroll utils
export const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// Line reveal hook
export function useLineReveal() {
    const ref = useRef<HTMLDivElement | null>(null)
    const [revealed, setRevealed] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect() } }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return { ref, revealed }
}

// Animated reveal divider
export const Divider = ({ className }: { className?: string }) => {
    const { ref, revealed } = useLineReveal()
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={`h-[2px] bg-white mx-auto origin-center transition-all duration-[2000ms] ease-out ${revealed ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} ${className ?? 'w-full max-w-[900px]'}`}
        />
    )
}

// Section title component
export const SectionTitle = ({ title, dividerClass }: { title: string; dividerClass?: string }) => {
    const { ref, revealed } = useLineReveal()
    return (
        <>
            <h3 className="text-center text-3xl font-semibold text-white mt-16 mb-4">{title}</h3>
            <div
                ref={ref}
                aria-hidden="true"
                className={`h-[2px] bg-white mx-auto mb-8 origin-center transition-all duration-[2000ms] ease-out ${revealed ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} ${dividerClass ?? 'w-full max-w-[600px]'}`}
            />
        </>
    )
}

// Photography hook
export function usePhotography() {
    const [sets, setSets] = useState<PhotoSet[]>([])
    useEffect(() => {
        getDocs(query(collection(db, 'photography'), orderBy('order'))).then((snap) =>
            setSets(snap.docs.map((doc) => {
                const d = doc.data()
                return {
                    title: d.title,
                    description: d.description,
                    details: d.details,
                    images: d.images ?? [],
                    order: d.order,
                    tags: d.tags ?? [],
                    year: d.year,
                }
            }))
        )
    }, [])
    return { sets }
}
