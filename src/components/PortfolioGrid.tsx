import { useEffect, useRef, useState } from 'react'
import Lightbox from '../modals/Lightbox'
import useLineReveal from '../hooks/useLineReveal'
import type { PortfolioImage, PortfolioSet, PortfolioImageWithMeta, RowData } from '../types/portfolio'

// Layout configuration constants
const MAX_WIDTH = 1920           // Maximum image width before resizing
const GAP = 8                    // Gap between images in pixels
const TARGET_ROW_HEIGHT = 300    // Ideal row height on desktop
const MAX_ROW_HEIGHT = 500       // Maximum row height cap for incomplete rows
const MOBILE_MAX_HEIGHT = 170    // Shorter row height on mobile for multi-image rows

type Props = {
  title?: string           // Section title displayed above grid
  sets: PortfolioSet[]     // Array of portfolio sets containing images
  showBorder?: boolean     // Whether to show white border around images
}

export default function PortfolioGrid({ title, sets, showBorder = true }: Props) {
  // DOM refs
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref: dividerRef, revealed: dividerInView } = useLineReveal()

  // State
  const [imageData, setImageData] = useState<(PortfolioImageWithMeta | null)[]>([])
  const [rows, setRows] = useState<RowData[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isPreloading, setIsPreloading] = useState(false)

  /**
   * Flatten all sets into a single array of images,
   * inheriting set-level metadata where image-level is not specified
   */
  const mergedImages: PortfolioImage[] = sets.flatMap((set) =>
    set.images.map((img) => ({
      ...img,
      title: img.title ?? set.setTitle,
      description: img.description ?? set.description,
      tags: img.tags ?? set.tags ?? [],
      other: img.other ?? set.other,
      date: img.date ?? (set.year ? `${set.year}-01-01` : undefined),
    }))
  )

  /**
   * Resize large images using canvas to improve performance
   * Returns data URL of resized image or original src if small enough
   */
  const resizeImage = (imgEl: HTMLImageElement): string => {
    if (!imgEl.width || imgEl.width <= MAX_WIDTH) return imgEl.src
    const scale = MAX_WIDTH / imgEl.width
    const canvas = document.createElement('canvas')
    canvas.width = MAX_WIDTH
    canvas.height = Math.round(imgEl.height * scale)
    canvas.getContext('2d')?.drawImage(imgEl, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.85)
  }

  /**
   * Preload all images and calculate their dimensions
   * Stores resized versions and aspect ratios for layout calculation
   */
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

  /**
   * Calculate row layout using a justified algorithm
   * Images are packed into rows and scaled to fill the container width
   * On mobile, uses shorter target height to allow multiple images per row
   */
  const calculateRows = () => {
    if (!containerRef.current) return
    const loadedImages = imageData.filter((x): x is PortfolioImageWithMeta => x !== null)
    if (!loadedImages.length) {
      setRows([])
      return
    }

    const containerWidth = containerRef.current.offsetWidth
    const isMobile = containerWidth < 640
    const targetHeight = isMobile ? MOBILE_MAX_HEIGHT : TARGET_ROW_HEIGHT
    const maxHeight = isMobile ? MOBILE_MAX_HEIGHT : MAX_ROW_HEIGHT

    const tempRows: RowData[] = []
    let currentRow: PortfolioImageWithMeta[] = []
    let currentRowWidth = 0

    loadedImages.forEach((img, index) => {
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
        tempRows.push({
          images: currentRow,
          scale: capped ? maxHeight / targetHeight : scale,
          capped,
        })
        currentRow = [img]
        currentRowWidth = scaledWidth
      }

      if (index === loadedImages.length - 1 && currentRow.length) {
        const totalGap = GAP * (currentRow.length - 1)
        const availableWidth = containerWidth - totalGap
        const totalImageWidth = currentRow.reduce((sum, i) => sum + i.aspectRatio * targetHeight, 0)
        const scale = availableWidth / totalImageWidth
        const capped = targetHeight * scale > maxHeight
        tempRows.push({
          images: currentRow,
          scale: capped ? maxHeight / targetHeight : scale,
          capped,
        })
      }
    })

    setRows(tempRows)
  }

  // Recalculate rows when image data changes
  useEffect(() => { calculateRows() }, [imageData])

  // Observe container resize and recalculate rows with debounce
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

  /**
   * Find the next/previous loaded image index (wraps around)
   * Skips any null entries in the image data array
   */
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

  // Keyboard navigation for lightbox (Escape, Arrow keys)
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
      {title && (
        <>
          <h3 className="text-center text-3xl font-semibold text-white mt-16 mb-4">{title}</h3>
          <div
            ref={dividerRef}
            aria-hidden="true"
            className={`h-[2px] bg-white w-full max-w-[90%] sm:max-w-[400px] md:max-w-[600px] mx-auto mb-8 origin-center transition-all duration-[2000ms] ease-out ${dividerInView ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
              }`}
          />
        </>
      )}

      <div ref={containerRef} className="w-full flex flex-col gap-2">
        {isPreloading && <div className="text-center text-sm text-slate-300 mb-2">Loading images…</div>}

        {rows.map((row, rowIndex) => {
          const isMobile = containerRef.current && containerRef.current.offsetWidth < 640
          const targetHeight = isMobile ? MOBILE_MAX_HEIGHT : TARGET_ROW_HEIGHT
          const scaledWidths = row.images.map((img) => img.aspectRatio * targetHeight * row.scale)

          return (
            <div
              key={rowIndex}
              className={`flex ${row.capped ? 'justify-center' : 'justify-between'}`}
              style={{ gap: `${GAP}px` }}
            >
              {row.images.map((img, idx) => {
                const width = scaledWidths[idx]
                const height = Math.round(targetHeight * row.scale)
                const flatIndex = img.originalIndex ?? idx

                return (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(flatIndex)}
                    className="relative overflow-visible p-0 border-0 focus:outline-none rounded-md transition-transform duration-300 hover:scale-[1.02]"
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
        images={imageData}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={() => setLightboxIndex((i) => i !== null ? findNextLoaded(i, 1) : null)}
        onPrev={() => setLightboxIndex((i) => i !== null ? findNextLoaded(i, -1) : null)}
      />
    </div>
  )
}

