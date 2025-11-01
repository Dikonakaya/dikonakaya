import React, { useEffect, useRef, useState } from 'react'

type Props = {
  images?: string[]
  interval?: number
}

const Carousel: React.FC<Props> = ({
  images = [
    'https://i.imgur.com/mRbxWae.jpeg',
    'https://i.imgur.com/Dj39gt9.jpeg',
    'https://i.imgur.com/Lsx3xpq.jpeg',
    'https://i.imgur.com/27S6hV4.jpeg',
    'https://i.imgur.com/dxt23tx.jpeg',
    'https://i.imgur.com/PqiFjAc.jpeg',
    'https://i.imgur.com/9SUBbRR.jpeg'
  ],
  interval = 4000,
}) => {
  // clone-first technique: append the first slide to the end so we can slide forward seamlessly
  const slides = [...images, images[0]]
  const slidesCount = slides.length
  const realCount = images.length

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
        {slides.map((src, i) => (
          <div
            key={i}
            className="h-full bg-center bg-cover flex-shrink-0"
            style={{ width: slideWidth, backgroundImage: `url(${src})` }}
            aria-hidden={i !== index}
          />
        ))}
      </div>

      {/* controls */}
      <button
        aria-label="Previous"
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 z-40 hover:bg-black/60 transition"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 z-40 hover:bg-black/60 transition"
      >
        ›
      </button>
    </div>
  )
}

export default Carousel
