import { useEffect, useRef, useState } from 'react'
import { useCarousel } from '../hooks'

type Props = { interval?: number }

export default function Carousel({ interval = 8000 }: Props) {
  const { slides } = useCarousel()

  // Bidirectional seamless loop layout
  const [index, setIndex] = useState(1)
  const [animating, setAnimating] = useState(true)
  const intervalRef = useRef<number | null>(null)
  const isSliding = useRef(false)
  // Stable refs so keyboard listeners always call the latest goPrev/goNext
  const goPrevRef = useRef<() => void>(() => { })
  const goNextRef = useRef<() => void>(() => { })

  const realCount = slides.length

  const stopAutoplay = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  const resetAutoplay = () => {
    stopAutoplay()
    intervalRef.current = window.setInterval(() => {
      if (isSliding.current) return
      isSliding.current = true
      setIndex(i => i + 1)
    }, interval)
  }

  useEffect(() => {
    if (!slides.length) return
    resetAutoplay()
    return stopAutoplay
  }, [interval, slides.length])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrevRef.current()
      else if (e.key === 'ArrowRight') goNextRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!slides.length) return null

  const allSlides = [slides[realCount - 1], ...slides, slides[0]]
  const totalSlides = allSlides.length
  const slideWidthPct = 100 / totalSlides

  const handleTransitionEnd = () => {
    isSliding.current = false
    if (index === 0) {
      // Prev from first: jumped to clone-of-last → snap to last real slide
      setAnimating(false)
      requestAnimationFrame(() => { setIndex(realCount); requestAnimationFrame(() => setAnimating(true)) })
    } else if (index === realCount + 1) {
      // Next from last: jumped to clone-of-first → snap to first real slide
      setAnimating(false)
      requestAnimationFrame(() => { setIndex(1); requestAnimationFrame(() => setAnimating(true)) })
    }
  }

  const goPrev = () => {
    if (isSliding.current) return
    stopAutoplay(); isSliding.current = true
    setIndex(i => i - 1)
    resetAutoplay()
  }
  goPrevRef.current = goPrev

  const goNext = () => {
    if (isSliding.current) return
    stopAutoplay(); isSliding.current = true
    setIndex(i => i + 1)
    resetAutoplay()
  }
  goNextRef.current = goNext

  // 0-based display index for dot indicator
  const displayIndex = (index - 1 + realCount) % realCount

  const goTo = (target: number) => {
    const targetIndex = target + 1
    if (isSliding.current || displayIndex === target) return
    stopAutoplay(); isSliding.current = true; setIndex(targetIndex); resetAutoplay()
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${animating ? 'transition-transform duration-1000 ease-in-out' : ''}`}
        style={{ width: `${totalSlides * 100}%`, transform: `translateX(-${index * slideWidthPct}%)` }}
      >
        {allSlides.map((slide, i) => {
          const external = slide.href?.startsWith('http') || slide.href?.startsWith('//')
          return (
            <div key={i} className="h-full flex-shrink-0" style={{ width: `${slideWidthPct}%` }} aria-hidden={i !== index}>
              <div className="relative w-full h-full group overflow-hidden">
                <div
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${slide.src})` }}
                />
                {slide.href ? (
                  <a href={slide.href} className="absolute inset-0 block" target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={slide.title ?? 'Open link'} />
                ) : (
                  <span className="absolute inset-0 block" />
                )}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/50" />
                <div className="absolute left-8 bottom-6 text-left text-white pointer-events-none">
                  <div className="text-xl font-extrabold">{slide.title ?? 'Untitled'}</div>
                  <div className="text-sm text-slate-200">{slide.subtitle ?? '\u2014'}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button aria-label="Previous" onClick={goPrev} onMouseUp={e => e.currentTarget.blur()} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full z-40 group">
        <span className="text-white bg-black/40 group-hover:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">‹</span>
      </button>

      <button aria-label="Next" onClick={goNext} onMouseUp={e => e.currentTarget.blur()} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full z-40 group">
        <span className="text-white bg-black/40 group-hover:bg-black/60 rounded-full w-6 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">›</span>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-black/40 hover:bg-black/60 rounded-full px-2 py-1 flex items-center gap-2 transition-colors">
          {slides.map((_, i) => (
            <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)} onMouseUp={e => e.currentTarget.blur()} className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${displayIndex === i ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
