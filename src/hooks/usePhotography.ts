import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import type { PhotoSet } from '../types/portfolio'

export default function usePhotography() {
    const [sets, setSets] = useState<PhotoSet[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDocs(query(collection(db, 'photography'), orderBy('order')))
            .then((snap) => {
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
                        collection: d.collection ?? false,
                    }
                }))
            })
            .finally(() => setLoading(false))
    }, [])

    return { sets, loading }
}
