import React, { useEffect, useRef, useState } from 'react'

type Slide = { src: string; href?: string; alt?: string; title?: string; subtitle?: string }
type Props = {
  images?: Array<string | Slide>
  interval?: number
}

const Carousel: React.FC<Props> = ({
  images = [
    { src: 'https://i.imgur.com/NLuGcjE.jpeg', href: '/#photography', title: 'Photography Works', subtitle: 'Pictures I\'ve taken in the past' },
    { src: 'https://i.imgur.com/FLY4xbF.jpeg', href: '/#photography', title: '2025 Keyboard Collection', subtitle: 'A collection of pictures I\'ve taken of my keyboards' },
    { src: 'https://i.imgur.com/z6OExwz.png', href: '/#pixelart', title: 'Past Commission Works', subtitle: 'Pixel art commissions I\'ve made in the past' },
    { src: 'https://i.imgur.com/F5yAqs7.png', href: '/projects', title: 'Hero of the Village', subtitle: 'A Minecraft texture pack project' },
  ],
  interval = 8000,
}) => {
  // images can be strings or objects {src, href, alt}
  const normalizedImages: Slide[] = (images || []).map((it) => (typeof it === 'string' ? { src: it } : it))
  // clone-first technique: append the first slide to the end so we can slide forward seamlessly
  if (normalizedImages.length === 0) return null

  const slides = [...normalizedImages, normalizedImages[0]]
  const slidesCount = slides.length
  const realCount = normalizedImages.length

  const [index, setIndex] = useState(0) // 0 .. realCount (realCount is the cloned slide)
  const [animating, setAnimating] = useState(true)
  const intervalRef = useRef<number | null>(null)
  const isSliding = useRef(false)

  function startAutoplay() {
    stopAutoplay()
    intervalRef.current = window.setInterval(() => {
      if (isSliding.current) return
      isSliding.current = true
      setIndex((i) => i + 1)
    }, interval)
  }

  function stopAutoplay() {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function resetAutoplay() {
    stopAutoplay()
    startAutoplay()
  }

  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [interval])

  useEffect(() => {
    // keep index bounded
    if (index > realCount) setIndex(0)
  }, [index, realCount])

  // when transition ends and we are on the cloned slide, snap to real 0 without animation
  function handleTransitionEnd() {
    // clear sliding flag for any ended transition
    isSliding.current = false

    if (index === realCount) {
      setAnimating(false)
      // next frame: snap index to 0, then re-enable animation on next frame
      requestAnimationFrame(() => {
        setIndex(0)
        requestAnimationFrame(() => setAnimating(true))
      })
    }
  }

  function goPrev() {
    // move backward; if at 0, jump to last real (we avoid negative indexes)
    if (isSliding.current) return
    stopAutoplay()
    isSliding.current = true
    setIndex((i) => (i - 1 < 0 ? realCount - 1 : i - 1))
    resetAutoplay()
  }

  function goNext() {
    if (isSliding.current) return
    stopAutoplay()
    isSliding.current = true
    setIndex((i) => i + 1)
    resetAutoplay()
  }

  function goTo(indexTarget: number) {
    if (isSliding.current) return
    // if already on the requested real slide, do nothing
    const curr = index % realCount
    if (curr === indexTarget) return
    stopAutoplay()
    isSliding.current = true
    setIndex(indexTarget)
    resetAutoplay()
  }

  const trackWidth = `${slidesCount * 100}%`
  const slideWidth = `${100 / slidesCount}%`

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${animating ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ width: trackWidth, transform: `translateX(-${index * (100 / slidesCount)}%)` }}
      >
        {slides.map((slide, i) => {
          const external = slide.href && (slide.href.startsWith('http://') || slide.href.startsWith('https://') || slide.href.startsWith('//'))
          return (
            <div
              key={i}
              className="h-full flex-shrink-0"
              style={{ width: slideWidth }}
              aria-hidden={i !== index}
            >
              <div className="relative w-full h-full group overflow-hidden">
                <div
                  className="absolute inset-0 bg-center bg-cover transform transition-transform duration-[1000ms] ease-in-out group-hover:scale-[1.05]"
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

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.5) 100%)' }}
                />

                <div className="absolute left-8 bottom-6 text-left text-white pointer-events-none">
                  <div className="text-xl font-extrabold">{slide.title ?? 'Untitled'}</div>
                  <div className="text-sm text-slate-200">{slide.subtitle ?? '—'}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* controls */}
      <button
        aria-label="Previous"
        onClick={goPrev}
        onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full z-40 group"
      >
        <span className="text-white bg-black/40 group-hover:bg-black/60 group-focus-visible:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transform transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-focus-visible:-translate-y-1 group-focus-visible:scale-105">‹</span>
      </button>
      <button
        aria-label="Next"
        onClick={goNext}
        onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full z-40 group"
      >
        <span className="text-white bg-black/40 group-hover:bg-black/60 group-focus-visible:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transform transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-focus-visible:-translate-y-1 group-focus-visible:scale-105">›</span>
      </button>

      {/* dots / indicators inside rounded container matching control buttons */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-black/40 hover:bg-black/60 rounded-full px-2 py-1 flex items-center gap-2 transition-colors">
          {images.map((_, i) => {
            const isActive = (index % realCount) === i
            return (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${isActive ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Carousel
