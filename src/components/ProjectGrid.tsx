import { useEffect, useRef, useState } from 'react'
import { scrollToId, SectionTitle } from '../functions'
import { useProjects } from '../hooks'

const MAX_WIDTH = 1920
const GAP = 8
const TARGET_ROW_HEIGHT = 300
const MAX_ROW_HEIGHT = 500
const TRANSITION_MS = 220

type ImageMeta = {
  src: string
  resizedSrc: string
  title: string
  description: string
  details: string
  tags: string
  view: string
  download: string
  year: number
  width: number
  height: number
  aspectRatio: number
  originalIndex: number
}

type RowData = { images: ImageMeta[]; scale: number; capped: boolean }

type Props = { title?: string }

export default function ProjectGrid({ title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { projects } = useProjects()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [hiddenHeaders, setHiddenHeaders] = useState<Set<number>>(new Set())
  const headerTimeoutRef = useRef<number | null>(null)
  const prevExpandedRef = useRef<number | null>(null)
  const [imageData, setImageData] = useState<(ImageMeta | null)[]>([])
  const [rows, setRows] = useState<RowData[]>([])
  const [isPreloading, setIsPreloading] = useState(false)

  useEffect(() => {
    if (!projects.length) { setIsPreloading(false); setImageData([]); return }
    let mounted = true
    setIsPreloading(true)
    setImageData(new Array(projects.length).fill(null))
    let loadedCount = 0

    projects.forEach((proj, idx) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = proj.thumbnail

      const done = (w: number, h: number, resizedSrc: string) => {
        if (!mounted) return
        setImageData(prev => {
          const copy = [...prev]
          copy[idx] = {
            src: proj.thumbnail, resizedSrc,
            title: proj.title, description: proj.description, details: proj.details,
            tags: proj.tags, view: proj.view, download: proj.download, year: proj.year,
            width: w, height: h, aspectRatio: w / h, originalIndex: idx,
          }
          return copy
        })
        if (++loadedCount === projects.length) setIsPreloading(false)
      }

      img.onload = () => {
        const w = Math.min(img.width, MAX_WIDTH)
        const h = Math.round((img.height * w) / img.width)
        let resizedSrc = img.src
        if (img.width > MAX_WIDTH) {
          const canvas = document.createElement('canvas')
          canvas.width = w; canvas.height = h
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
          resizedSrc = canvas.toDataURL('image/jpeg', 0.85)
        }
        done(w, h, resizedSrc)
      }
      img.onerror = () => done(1200, 792, proj.thumbnail)
    })

    return () => { mounted = false }
  }, [projects])

  const calculateRows = (): RowData[] => {
    if (!containerRef.current) return []
    const loaded = imageData.filter((x): x is ImageMeta => x !== null)
    if (!loaded.length) return []

    const containerWidth = containerRef.current.offsetWidth
    const tempRows: RowData[] = []
    let currentRow: ImageMeta[] = []
    let currentRowWidth = 0

    loaded.forEach((img, index) => {
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

      if (index === loaded.length - 1 && currentRow.length) {
        const totalGap = GAP * (currentRow.length - 1)
        const scale = (containerWidth - totalGap) / currentRowWidth
        const capped = TARGET_ROW_HEIGHT * scale > MAX_ROW_HEIGHT
        tempRows.push({ images: currentRow, scale: capped ? MAX_ROW_HEIGHT / TARGET_ROW_HEIGHT : scale, capped })
      }
    })

    return tempRows
  }

  useEffect(() => {
    setRows(calculateRows())
    if (!containerRef.current) return
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setRows(calculateRows()))
    })
    ro.observe(containerRef.current)
    return () => { ro.disconnect(); cancelAnimationFrame(raf) }
  }, [imageData])

  useEffect(() => {
    if (headerTimeoutRef.current) clearTimeout(headerTimeoutRef.current)
    if (expandedIndex !== null) {
      setHiddenHeaders(prev => new Set(prev).add(expandedIndex))
      prevExpandedRef.current = expandedIndex
    } else if (prevExpandedRef.current !== null) {
      const last = prevExpandedRef.current
      headerTimeoutRef.current = window.setTimeout(() => {
        setHiddenHeaders(prev => { const copy = new Set(prev); copy.delete(last); return copy })
        prevExpandedRef.current = null
      }, 300)
    }
    return () => { if (headerTimeoutRef.current) clearTimeout(headerTimeoutRef.current) }
  }, [expandedIndex])

  const toggleExpanded = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = expandedIndex === idx ? null : idx
    setExpandedIndex(next)
    if (next !== null) requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(`project-${idx}`)))
  }

  return (
    <div className="w-full">
      {title && <SectionTitle title={title} dividerClass="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[600px] mb-5" />}
      <div ref={containerRef} className="w-full flex flex-col gap-4 relative">
        {isPreloading && <div className="text-center text-sm text-slate-300 mb-2">Loading projects…</div>}
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`pg-row flex flex-wrap ${row.capped ? 'justify-center' : ''} gap-4`}
            style={{ transform: `scale(${row.capped ? 0.98 : 1})`, transition: `transform ${TRANSITION_MS}ms ease` }}
          >
            {row.images.map((img) => {
              const width = img.aspectRatio * TARGET_ROW_HEIGHT * row.scale
              const height = Math.round(TARGET_ROW_HEIGHT * row.scale)
              const isExpanded = expandedIndex === img.originalIndex
              const smallVisible = !isExpanded && !hiddenHeaders.has(img.originalIndex)
              return (
                <div
                  id={`project-${img.originalIndex}`}
                  key={img.originalIndex}
                  className="relative scroll-mt-24 group overflow-visible p-0 border-0 rounded-md transition-transform duration-300 hover:scale-[1.02]"
                  onClick={e => toggleExpanded(img.originalIndex, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpanded(img.originalIndex, e as unknown as React.MouseEvent) } }}
                  aria-expanded={isExpanded}
                >
                  <div className="relative rounded-t-md bg-black" style={{ width, height }}>
                    <div className="relative rounded-md overflow-hidden h-full w-full">
                      <img
                        src={img.resizedSrc}
                        alt={img.title}
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
                      <h4 className="text-lg font-semibold text-white">{img.title}</h4>
                      {img.description && <p className="mt-1 text-sm text-slate-300">{img.description}</p>}
                      {img.details && <p className="mt-2 text-sm text-slate-400">{img.details}</p>}
                      <div className="mt-3 text-xs text-slate-400">
                        {img.year > 0 && <span className="mr-3">Year: {img.year}</span>}
                        {img.tags && <span>Tags: {img.tags}</span>}
                      </div>
                      <div className="mt-4 flex gap-3">
                        {img.view && (
                          <a href={img.view} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 min-w-[160px] rounded-md bg-green-600 text-white text-base font-medium hover:bg-white hover:text-[#373944] transition-colors">
                            View Project
                          </a>
                        )}
                        {img.download && (
                          <a href={img.download} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 min-w-[160px] rounded-md bg-blue-600 text-white text-base font-medium hover:bg-white hover:text-[#373944] transition-colors">
                            Download
                          </a>
                        )}
                      </div>
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
