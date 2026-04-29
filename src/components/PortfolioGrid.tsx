import { useEffect, useRef, useState } from 'react'
import Lightbox from '../modals/Lightbox'
import { SectionTitle } from '../functions'
import type { PhotoSet } from '../hooks'

const MAX_WIDTH = 1920
const GAP = 8
const MAX_ROW_HEIGHT = 500
const MOBILE_MAX_HEIGHT = 170

type ImageMeta = {
  src: string
  title: string
  description: string
  details?: string
  tags: string[]
  display: boolean
  width: number
  height: number
  aspectRatio: number
  resizedSrc: string
  originalIndex: number
}

type RowData = { images: ImageMeta[]; scale: number; capped: boolean }

type Props = {
  title?: string
  sets: PhotoSet[]
  showBorder?: boolean
  targetRowHeight?: number
  initialOpenSrc?: string
}

export default function PortfolioGrid({ title, sets, showBorder = true, targetRowHeight = 300, initialOpenSrc }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageData, setImageData] = useState<(ImageMeta | null)[]>([])
  const [rows, setRows] = useState<RowData[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isPreloading, setIsPreloading] = useState(false)
  const openedInitialRef = useRef(false)

  const flatImages = sets.flatMap((set) =>
    set.images.map((img) => {
      const o = typeof img === 'object' ? img : null
      return {
        src: o ? o.url : img as string,
        title: o?.title || set.title,
        description: o?.description || set.description,
        details: o?.details || set.details,
        tags: o?.tags?.length ? o.tags : set.tags,
        display: o ? o.display !== false : true,
      }
    })
  )

  useEffect(() => {
    if (!flatImages.length) {
      setIsPreloading(false)
      setImageData([])
      return
    }

    let mounted = true
    setIsPreloading(true)
    setImageData(new Array(flatImages.length).fill(null))
    let loadedCount = 0

    flatImages.forEach((it, idx) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = it.src

      const done = (w: number, h: number, resizedSrc: string) => {
        if (!mounted) return
        setImageData((prev) => {
          const copy = [...prev]
          copy[idx] = { ...it, width: w, height: h, aspectRatio: w / h, resizedSrc, originalIndex: idx }
          return copy
        })
        if (++loadedCount === flatImages.length) setIsPreloading(false)
      }

      img.onload = () => {
        const w = Math.min(img.width, MAX_WIDTH)
        done(w, Math.round((img.height * w) / img.width), img.src)
        // Open lightbox for the clicked image once it loads
        if (initialOpenSrc && !openedInitialRef.current && it.src === initialOpenSrc) {
          openedInitialRef.current = true
          setLightboxIndex(idx)
        }
      }
      img.onerror = () => done(1200, 792, it.src)
    })

    return () => { mounted = false }
  }, [sets])

  const calculateRows = () => {
    if (!containerRef.current) return
    const loaded = imageData.filter((x): x is ImageMeta => x !== null && x.display)
    if (!loaded.length) {
      setRows([])
      return
    }

    const containerWidth = containerRef.current.offsetWidth
    const isMobile = containerWidth < 1024
    const targetHeight = isMobile ? MOBILE_MAX_HEIGHT : targetRowHeight
    const maxHeight = isMobile ? MOBILE_MAX_HEIGHT : MAX_ROW_HEIGHT

    const tempRows: RowData[] = []

    if (isMobile) {
      for (let i = 0; i < loaded.length; i += 2) {
        const rowImages = loaded.slice(i, i + 2)
        const totalGap = GAP * (rowImages.length - 1)
        const availableWidth = containerWidth - totalGap
        const totalAspectRatio = rowImages.reduce((sum, img) => sum + img.aspectRatio, 0)
        const rowHeight = availableWidth / totalAspectRatio
        const singleImageMaxHeight = MOBILE_MAX_HEIGHT * 1.5
        const cappedHeight = rowImages.length === 1 ? Math.min(rowHeight, singleImageMaxHeight) : rowHeight
        tempRows.push({
          images: rowImages,
          scale: cappedHeight / targetHeight,
          capped: rowImages.length === 1 && rowHeight > singleImageMaxHeight,
        })
      }
    } else {
      let currentRow: ImageMeta[] = []
      let currentRowWidth = 0

      loaded.forEach((img, index) => {
        const scaledWidth = img.aspectRatio * targetHeight
        const gap = currentRow.length > 0 ? GAP : 0

        if (currentRowWidth + scaledWidth + gap <= containerWidth) {
          currentRow.push(img)
          currentRowWidth += scaledWidth + gap
        } else {
          const totalGap = GAP * (currentRow.length - 1)
          const availableWidth = containerWidth - totalGap
          const totalImageWidth = currentRow.reduce((sum, i) => sum + i.aspectRatio * targetHeight, 0)
          const scale = availableWidth / totalImageWidth
          const capped = targetHeight * scale > maxHeight
          tempRows.push({ images: currentRow, scale: capped ? maxHeight / targetHeight : scale, capped })
          currentRow = [img]
          currentRowWidth = scaledWidth
        }

        if (index === loaded.length - 1 && currentRow.length) {
          const totalGap = GAP * (currentRow.length - 1)
          const availableWidth = containerWidth - totalGap
          const totalImageWidth = currentRow.reduce((sum, i) => sum + i.aspectRatio * targetHeight, 0)
          const scale = availableWidth / totalImageWidth
          const capped = targetHeight * scale > maxHeight
          tempRows.push({ images: currentRow, scale: capped ? maxHeight / targetHeight : scale, capped })
        }
      })
    }

    setRows(tempRows)
  }

  useEffect(() => { calculateRows() }, [imageData])

  useEffect(() => {
    if (!containerRef.current) return
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(calculateRows)
    })
    ro.observe(containerRef.current)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [imageData])

  const findNextLoaded = (start: number, dir: 1 | -1) => {
    const n = imageData.length
    if (!n) return start
    let i = start
    do {
      i = (i + dir + n) % n
      if (imageData[i]) return i
    } while (i !== start)
    return start
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      else if (e.key === 'ArrowRight') setLightboxIndex((i) => i !== null ? findNextLoaded(i, 1) : null)
      else if (e.key === 'ArrowLeft') setLightboxIndex((i) => i !== null ? findNextLoaded(i, -1) : null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, imageData.length])

  return (
    <div className="w-full">
      {title && <SectionTitle title={title} dividerClass="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[600px]" />}

      <div ref={containerRef} className="w-full flex flex-col gap-2">
        {isPreloading && <div className="text-center text-sm text-slate-300 mb-2">Loading images…</div>}

        {rows.map((row, rowIndex) => {
          const isMobile = containerRef.current && containerRef.current.offsetWidth < 1024
          const targetHeight = isMobile ? MOBILE_MAX_HEIGHT : targetRowHeight
          const rowHeight = Math.round(targetHeight * row.scale)
          const scaledWidths = row.images.map((img) => img.aspectRatio * rowHeight)

          return (
            <div
              key={rowIndex}
              className={`flex ${row.capped ? 'justify-center' : 'justify-between'}`}
              style={{ gap: `${GAP}px` }}
            >
              {row.images.map((img, idx) => {
                const width = scaledWidths[idx]
                const height = rowHeight
                const flatIndex = img.originalIndex ?? idx

                return (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(flatIndex)}
                    className="hover-elevate overflow-visible p-0 border-0 focus:outline-none rounded-md hover:scale-[1.02]"
                    style={{ flex: row.capped ? 'none' : `0 0 ${width}px` }}
                  >
                    <div className="relative group">
                      <div
                        className={`relative rounded-md overflow-hidden ${showBorder ? 'border-2 border-white' : ''}`}
                        style={{ width, height }}
                      >
                        <img
                          src={img.resizedSrc}
                          alt={img.title || ''}
                          className="w-full h-full object-cover block transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                          loading="lazy"
                        />
                      </div>

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute rounded-md inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                        <div className="relative flex flex-col justify-start p-4 text-left text-white">
                          <h4 className="text-lg font-semibold">{img.title}</h4>
                          <p className="text-sm mt-1">{img.description}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      <Lightbox
        images={imageData.map((d) => d ? { resizedSrc: d.resizedSrc, title: d.title, description: d.description, other: d.details, tags: d.tags } : null)}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={() => setLightboxIndex((i) => i !== null ? findNextLoaded(i, 1) : null)}
        onPrev={() => setLightboxIndex((i) => i !== null ? findNextLoaded(i, -1) : null)}
      />
    </div>
  )
}

