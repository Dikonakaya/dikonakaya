import { useEffect, useRef, useState } from 'react'

// Slide data structure
type Slide = { src: string; href?: string; alt?: string; title?: string; subtitle?: string }
type Props = {
  images?: (string | Slide)[]  // Array of image URLs or slide objects
  interval?: number            // Autoplay interval in milliseconds
}

// Default carousel slides showcasing portfolio highlights
const defaultImages: Slide[] = [
  { src: 'https://i.imgur.com/NLuGcjE.jpeg', href: '/#photography', title: 'Photography Works', subtitle: "Pictures I've taken in the past" },
  { src: 'https://i.imgur.com/FLY4xbF.jpeg', href: '/#photography', title: '2025 Keyboard Collection', subtitle: "A collection of pictures I've taken of my keyboards" },
  { src: 'https://i.imgur.com/z6OExwz.png', href: '/#pixelart', title: 'Past Commission Works', subtitle: "Pixel art commissions I've made in the past" },
  { src: 'https://i.imgur.com/F5yAqs7.png', href: '/projects', title: 'Hero of the Village', subtitle: 'A Minecraft texture pack project' },
]

export default function Carousel({ images = defaultImages, interval = 8000 }: Props) {
  // Normalize string inputs to Slide objects
  const normalizedImages: Slide[] = images.map((it) => typeof it === 'string' ? { src: it } : it)
  if (!normalizedImages.length) return null

  // Duplicate first slide at end for seamless loop animation
  const slides = [...normalizedImages, normalizedImages[0]]
  const realCount = normalizedImages.length

  // State and refs
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(true)
  const intervalRef = useRef<number | null>(null)
  const isSliding = useRef(false)

  // Autoplay control functions
  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startAutoplay = () => {
    stopAutoplay()
    intervalRef.current = window.setInterval(() => {
      if (isSliding.current) return
      isSliding.current = true
      setIndex((i) => i + 1)
    }, interval)
  }

  const resetAutoplay = () => {
    stopAutoplay()
    startAutoplay()
  }

  // Start autoplay on mount
  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [interval])

  // Handle wrap-around when reaching the duplicate slide
  useEffect(() => {
    if (index > realCount) setIndex(0)
  }, [index, realCount])

  /**
   * Handle seamless loop: when reaching the duplicate last slide,
   * instantly jump to the real first slide without animation
   */
  const handleTransitionEnd = () => {
    isSliding.current = false
    if (index === realCount) {
      setAnimating(false)
      requestAnimationFrame(() => {
        setIndex(0)
        requestAnimationFrame(() => setAnimating(true))
      })
    }
  }

  // Navigation handlers
  const goPrev = () => {
    if (isSliding.current) return
    stopAutoplay()
    isSliding.current = true
    setIndex((i) => (i - 1 < 0 ? realCount - 1 : i - 1))
    resetAutoplay()
  }

  const goNext = () => {
    if (isSliding.current) return
    stopAutoplay()
    isSliding.current = true
    setIndex((i) => i + 1)
    resetAutoplay()
  }

  const goTo = (target: number) => {
    if (isSliding.current || index % realCount === target) return
    stopAutoplay()
    isSliding.current = true
    setIndex(target)
    resetAutoplay()
  }

  const trackWidth = `${slides.length * 100}%`
  const slideWidth = `${100 / slides.length}%`

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${animating ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ width: trackWidth, transform: `translateX(-${index * (100 / slides.length)}%)` }}
      >
        {slides.map((slide, i) => {
          const external = slide.href?.startsWith('http://') || slide.href?.startsWith('https://') || slide.href?.startsWith('//')
          return (
            <div key={i} className="h-full flex-shrink-0" style={{ width: slideWidth }} aria-hidden={i !== index}>
              <div className="relative w-full h-full group overflow-hidden">
                <div
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${slide.src})` }}
                />
                {slide.href ? (
                  <a
                    href={slide.href}
                    className="absolute inset-0 block"
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={slide.alt ?? slide.title ?? 'Open image link'}
                  />
                ) : (
                  <span className="absolute inset-0 block" />
                )}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/50" />
                <div className="absolute left-8 bottom-6 text-left text-white pointer-events-none">
                  <div className="text-xl font-extrabold">{slide.title ?? 'Untitled'}</div>
                  <div className="text-sm text-slate-200">{slide.subtitle ?? '—'}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        aria-label="Previous"
        onClick={goPrev}
        onMouseUp={(e) => e.currentTarget.blur()}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full z-40 group"
      >
        <span className="text-white bg-black/40 group-hover:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105">‹</span>
      </button>

      <button
        aria-label="Next"
        onClick={goNext}
        onMouseUp={(e) => e.currentTarget.blur()}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full z-40 group"
      >
        <span className="text-white bg-black/40 group-hover:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-105">›</span>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-black/40 hover:bg-black/60 rounded-full px-2 py-1 flex items-center gap-2 transition-colors">
          {normalizedImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              onMouseUp={(e) => e.currentTarget.blur()}
              className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${index % realCount === i ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
