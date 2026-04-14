import { useEffect, useRef, useState } from 'react'
import { projectsData } from '../data/projects.data'
import { scrollToId, SectionTitle } from '../Shared'
import type { PortfolioImage, PortfolioSet, PortfolioImageWithMeta, RowData } from '../types/portfolio'

const MAX_WIDTH = 1920
const GAP = 8
const TARGET_ROW_HEIGHT = 300
const MAX_ROW_HEIGHT = 500
const TRANSITION_MS = 220

type Props = {
    title?: string
    sets?: PortfolioSet[]
}

export default function ProjectGrid({ title, sets }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [hiddenHeaders, setHiddenHeaders] = useState<Set<number>>(new Set())
    const headerTimeoutRef = useRef<number | null>(null)
    const prevExpandedRef = useRef<number | null>(null)
    const [imageData, setImageData] = useState<(PortfolioImageWithMeta | null)[]>([])
    const [rows, setRows] = useState<RowData[]>([])
    const [isPreloading, setIsPreloading] = useState(false)

    const mergedImages: PortfolioImage[] = sets?.length
        ? sets.map((set) => ({
            src: set.images?.[0]?.src || '',
            title: set.setTitle,
            description: set.description ?? set.setTitle,
            tags: set.images?.[0]?.tags ?? set.tags ?? [],
            other: set.images?.[0]?.other ?? set.other,
            date: set.images?.[0]?.date ?? (set.year ? `${set.year}-01-01` : undefined),
        }))
        : projectsData.map((proj) => ({
            src: proj.thumbnail || proj.images?.[0]?.src || '',
            title: proj.name,
            description: proj.subtitle ?? proj.description ?? '',
            tags: proj.tags ?? [],
            date: proj.year ? `${proj.year}-01-01` : undefined,
        }))

    const resizeImage = (imgEl: HTMLImageElement): string => {
        if (!imgEl.width || imgEl.width <= MAX_WIDTH) return imgEl.src
        const scale = MAX_WIDTH / imgEl.width
        const canvas = document.createElement('canvas')
        canvas.width = MAX_WIDTH
        canvas.height = Math.round(imgEl.height * scale)
        canvas.getContext('2d')?.drawImage(imgEl, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL('image/jpeg', 0.85)
    }

    useEffect(() => {
        let mounted = true
        setIsPreloading(true)
        setImageData(new Array(mergedImages.length).fill(null))
        let loadedCount = 0

        mergedImages.forEach((it, idx) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.src = it.src

            const onLoad = () => {
                if (!mounted) return
                const resizedSrc = resizeImage(img)
                const width = Math.min(img.width, MAX_WIDTH)
                const height = Math.round((img.height * width) / img.width)

                setImageData((prev) => {
                    const copy = [...prev]
                    copy[idx] = { ...it, width, height, aspectRatio: width / height, resizedSrc, originalIndex: idx }
                    return copy
                })
                if (++loadedCount === mergedImages.length) setIsPreloading(false)
            }

            const onError = () => {
                if (!mounted) return
                const fallbackWidth = Math.min(MAX_WIDTH, 1200)
                const fallbackHeight = Math.round(fallbackWidth * 0.66)

                setImageData((prev) => {
                    const copy = [...prev]
                    copy[idx] = {
                        ...it,
                        width: fallbackWidth,
                        height: fallbackHeight,
                        aspectRatio: fallbackWidth / fallbackHeight,
                        resizedSrc: it.src,
                        originalIndex: idx,
                    }
                    return copy
                })
                if (++loadedCount === mergedImages.length) setIsPreloading(false)
            }

            img.onload = onLoad
            img.onerror = onError
        })

        return () => { mounted = false }
    }, [sets])

    const calculateRows = (): RowData[] => {
        if (!containerRef.current) return []
        const loadedImages = imageData.filter((x): x is PortfolioImageWithMeta => x !== null)
        if (!loadedImages.length) return []

        const containerWidth = containerRef.current.offsetWidth
        const tempRows: RowData[] = []
        let currentRow: PortfolioImageWithMeta[] = []
        let currentRowWidth = 0

        loadedImages.forEach((img, index) => {
            const scaledWidth = img.aspectRatio * TARGET_ROW_HEIGHT
            const gap = currentRow.length > 0 ? GAP : 0

            if (currentRowWidth + scaledWidth + gap <= containerWidth) {
                currentRow.push(img)
                currentRowWidth += scaledWidth + gap
            } else {
                const totalGap = GAP * (currentRow.length - 1)
                const scale = (containerWidth - totalGap) / currentRowWidth
                const capped = TARGET_ROW_HEIGHT * scale > MAX_ROW_HEIGHT
                tempRows.push({ images: currentRow, scale: capped ? MAX_ROW_HEIGHT / TARGET_ROW_HEIGHT : scale, capped })
                currentRow = [img]
                currentRowWidth = scaledWidth
            }

            if (index === loadedImages.length - 1 && currentRow.length) {
                const totalGap = GAP * (currentRow.length - 1)
                const scale = (containerWidth - totalGap) / currentRowWidth
                const capped = TARGET_ROW_HEIGHT * scale > MAX_ROW_HEIGHT
                tempRows.push({ images: currentRow, scale: capped ? MAX_ROW_HEIGHT / TARGET_ROW_HEIGHT : scale, capped })
            }
        })

        return tempRows
    }

    useEffect(() => {
        if (headerTimeoutRef.current) clearTimeout(headerTimeoutRef.current)

        if (expandedIndex !== null) {
            setHiddenHeaders((prev) => new Set(prev).add(expandedIndex))
            prevExpandedRef.current = expandedIndex
        } else if (prevExpandedRef.current !== null) {
            const last = prevExpandedRef.current
            headerTimeoutRef.current = window.setTimeout(() => {
                setHiddenHeaders((prev) => {
                    const copy = new Set(prev)
                    copy.delete(last)
                    return copy
                })
                prevExpandedRef.current = null
            }, 300)
        }

        return () => { if (headerTimeoutRef.current) clearTimeout(headerTimeoutRef.current) }
    }, [expandedIndex])

    useEffect(() => {
        setRows(calculateRows())
        if (!containerRef.current) return

        let raf = 0
        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => setRows(calculateRows()))
        })
        ro.observe(containerRef.current)
        return () => {
            ro.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [imageData])
    const toggleExpanded = (idx: number | undefined, e: React.MouseEvent) => {
        e.stopPropagation()
        const next = expandedIndex === idx ? null : idx ?? null
        setExpandedIndex(next)
        if (idx !== undefined) {
            requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(`project-${idx}`)))
        }
    }

    return (
        <div className="w-full">
            {title && <SectionTitle title={title} />}

            <div ref={containerRef} className="w-full flex flex-col gap-4 relative">
                {isPreloading && <div className="text-center text-sm text-slate-300 mb-2">Loading projects…</div>}

                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`pg-row flex flex-wrap ${row.capped ? 'justify-center' : ''} gap-4`}
                        style={{ transform: `scale(${row.capped ? 0.98 : 1})`, transition: `transform ${TRANSITION_MS}ms ease` }}
                    >
                        {row.images.map((img, idx) => {
                            const width = img.aspectRatio * TARGET_ROW_HEIGHT * row.scale
                            const height = Math.round(TARGET_ROW_HEIGHT * row.scale)
                            const isExpanded = expandedIndex === img.originalIndex
                            const proj = img.originalIndex !== undefined ? projectsData[img.originalIndex] : undefined
                            const smallVisible = !isExpanded && !(img.originalIndex !== undefined && hiddenHeaders.has(img.originalIndex))

                            return (
                                <div
                                    id={`project-${img.originalIndex}`}
                                    key={img.originalIndex}
                                    className="relative scroll-mt-24 group overflow-visible p-0 border-0 rounded-md transition-transform duration-300 hover:scale-[1.02]"
                                    onClick={(e) => toggleExpanded(img.originalIndex, e)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpanded(img.originalIndex, e as any) } }}
                                    aria-expanded={isExpanded}
                                >
                                    <div className="relative rounded-t-md bg-black" style={{ width, height }}>
                                        <div className="relative rounded-md overflow-hidden h-full w-full">
                                            <img
                                                src={img.resizedSrc}
                                                alt={img.title || ''}
                                                className="w-full h-full object-cover block transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ width }} aria-hidden={!smallVisible}>
                                        <div className="overflow-hidden transition-[max-height] duration-300" style={{ maxHeight: smallVisible ? 200 : 0 }}>
                                            <div className={`text-left text-white bg-black rounded-b-md px-2 py-2 transition-opacity duration-300 ${smallVisible ? 'opacity-100' : 'opacity-0'}`}>
                                                <h4 className="text-sm font-semibold">{img.title}</h4>
                                                <p className="text-xs text-slate-300 truncate">{img.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden transition-[max-height] duration-300 rounded-b-md" style={{ maxHeight: isExpanded ? 400 : 0 }}>
                                        <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100 delay-[120ms]' : 'opacity-0'} bg-black rounded-b-md px-4 py-4`}>
                                            {proj ? (
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white">{proj.name}</h4>
                                                    {proj.subtitle && <p className="text-sm text-slate-300 mt-1">{proj.subtitle}</p>}
                                                    {proj.description && <p className="mt-2 text-sm text-slate-300">{proj.description}</p>}
                                                    <div className="mt-3 text-xs text-slate-400">
                                                        {proj.year && <span className="mr-3">Year: {proj.year}</span>}
                                                        {proj.tags && <span>Tags: {proj.tags.join(', ')}</span>}
                                                    </div>
                                                    <div className="mt-4 flex gap-3">
                                                        {proj.viewUrl && (
                                                            <a href={proj.viewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 min-w-[160px] rounded-md bg-green-600 text-white text-base font-medium hover:bg-white hover:text-[#373944] transition-colors">
                                                                View Project
                                                            </a>
                                                        )}
                                                        {proj.getUrl && (
                                                            <a href={proj.getUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 min-w-[160px] rounded-md bg-blue-600 text-white text-base font-medium hover:bg-white hover:text-[#373944] transition-colors">
                                                                Get Project
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white">{img.title}</h4>
                                                    <p className="mt-2 text-sm text-slate-300">{img.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
