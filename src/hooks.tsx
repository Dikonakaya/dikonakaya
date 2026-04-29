import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export type PhotoImage = {
    url: string
    title?: string
    description?: string
    details?: string
    year?: number
    tags?: string[]
    display?: boolean
}

export type PhotoSet = {
    title: string
    description: string
    details?: string
    images: (string | PhotoImage)[]
    order?: number
    tags: string[]
    year?: number
}

// Portfolio data hook
function usePortfolio(collectionName: string) {
    const [sets, setSets] = useState<PhotoSet[]>([])
    useEffect(() => {
        getDocs(query(collection(db, collectionName), orderBy('order'))).then((snap) =>
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

export function usePhotography() { return usePortfolio('photography') }
export function usePixelArt() { return usePortfolio('pixelart') }

// Carousel data hook
export type CarouselSlide = { src: string; href?: string; title?: string; subtitle?: string }
export function useCarousel() {
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    useEffect(() => {
        getDocs(query(collection(db, 'carousel'), orderBy('order'))).then(snap => {
            setSlides(snap.docs.map(d => {
                const data = d.data()
                return { src: data.thumbnail, href: data.url || undefined, title: data.title, subtitle: data.description }
            }))
        })
    }, [])
    return { slides }
}

// Projects data hook
export type FirebaseProject = {
    id: string
    title: string
    description: string
    details: string
    download: string
    tags: string
    thumbnail: string
    view: string
    order: number
    year: number
}
export function useProjects() {
    const [projects, setProjects] = useState<FirebaseProject[]>([])
    useEffect(() => {
        getDocs(query(collection(db, 'projects'), orderBy('order'))).then(snap => {
            setProjects(snap.docs.map((d, i) => {
                const data = d.data()
                return {
                    id: d.id, title: data.title || '', description: data.description || '', details: data.details || '', download: data.download || '', tags: data.tags || '', thumbnail: data.thumbnail || '', view: data.view || '',
                    order: data.order ?? i,
                    year: data.year || 0,
                }
            }))
        })
    }, [])
    return { projects }
}

// Skills data hook
export type FirebaseSkill = {
    id: string
    title: string
    description: string
    status: string
    year: number
    order: number
}
export function useSkills() {
    const [skills, setSkills] = useState<FirebaseSkill[]>([])
    useEffect(() => {
        getDocs(query(collection(db, 'skills'), orderBy('order'))).then(snap => {
            setSkills(snap.docs.map((d, i) => {
                const data = d.data()
                return { id: d.id, title: data.title || '', description: data.description || '', status: data.status || '', year: data.year || 0, order: data.order ?? i }
            }))
        })
    }, [])
    return { skills }
}

// Experience data hook
export type FirebaseExperience = {
    id: string
    role: string
    company: string
    period: string
    details: string
    order: number
}
export function useExperience() {
    const [experience, setExperience] = useState<FirebaseExperience[]>([])
    useEffect(() => {
        getDocs(query(collection(db, 'experience'), orderBy('order'))).then(snap => {
            setExperience(snap.docs.map((d, i) => {
                const data = d.data()
                return { id: d.id, role: data.role || '', company: data.company || '', period: data.period || '', details: data.details || '', order: data.order ?? i }
            }))
        })
    }, [])
    return { experience }
}
