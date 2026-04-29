import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrollToTop } from '../functions'
import type { PhotoSet } from '../hooks'

function getImageItem(img: string | { url?: string; title?: string; description?: string; display?: boolean }, setTitle: string, setDescription: string): { src: string; title: string; description: string } | null {
    if (typeof img === 'string') return { src: img, title: setTitle, description: setDescription }
    if (img.display === false) return null
    if (!img.url) return null
    return { src: img.url, title: img.title || setTitle, description: img.description || setDescription }
}

type Props = {
    sets: PhotoSet[]
    height?: number
    linkTo?: string
    showBorder?: boolean
    duration?: number
    mobileDuration?: number
    reverse?: boolean
}

export default function Marquee({ sets, height = 180, linkTo, showBorder = false, duration = 120, mobileDuration = 240, reverse = false }: Props) {
    const outerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)
    // All mutable scroll state in one ref — avoids stale closure issues entirely
    const sc = useRef({
        offsetX: 0,
        velocity: 0, // px/ms
        isDragging: false,
        prevX: 0,
        prevTime: 0,
        rafId: 0,
        hasDragged: false,
        dragStartX: 0,
    })

    const items = sets
        .flatMap(set => set.images.map(img => getImageItem(img as string | { url?: string; title?: string; description?: string; display?: boolean }, set.title, set.description)))
        .filter((u): u is { src: string; title: string; description: string } => u !== null)

    const doubled = [...items, ...items]

    // RAF loop: auto-scroll + momentum
    useEffect(() => {
        sc.current.velocity = 0
        let initialized = false
        let lastTime = performance.now()
        const FRICTION = 0.92 // per 16 ms, scaled to actual dt

        const getSingleWidth = () =>
            innerRef.current ? innerRef.current.scrollWidth / 2 : 0

        const tick = (now: number) => {
            const dt = Math.min(now - lastTime, 50)
            lastTime = now

            const singleWidth = getSingleWidth()
            if (singleWidth <= 0) {
                sc.current.rafId = requestAnimationFrame(tick)
                return
            }

            if (!initialized) {
                if (reverse && outerRef.current) {
                    // Position so the last image sits at the right edge of the viewport
                    sc.current.offsetX = Math.max(0, singleWidth - outerRef.current.offsetWidth)
                } else {
                    sc.current.offsetX = 0
                }
                initialized = true
            }

            const effectiveDuration = (window.innerWidth < 1024 ? mobileDuration : duration) * 1000
            const autoSpeed = singleWidth / effectiveDuration // px/ms

            if (!sc.current.isDragging) {
                sc.current.offsetX += reverse ? -autoSpeed * dt : autoSpeed * dt
            }

            // Momentum coast (independent of drag state)
            if (Math.abs(sc.current.velocity) > 0.0005) {
                sc.current.offsetX += sc.current.velocity * dt
                sc.current.velocity *= Math.pow(FRICTION, dt / 16)
                if (Math.abs(sc.current.velocity) < 0.0005) sc.current.velocity = 0
            }

            // Seamless wrap — works in both directions
            sc.current.offsetX = ((sc.current.offsetX % singleWidth) + singleWidth) % singleWidth

            if (innerRef.current) {
                innerRef.current.style.transform = `translateX(-${sc.current.offsetX}px)`
            }

            sc.current.rafId = requestAnimationFrame(tick)
        }

        sc.current.rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(sc.current.rafId)
    }, [duration, mobileDuration, reverse, items.length])

    // Document-level mouse events (prevents stuck cursor state)
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!sc.current.isDragging) return
            e.preventDefault()
            if (Math.abs(e.pageX - sc.current.dragStartX) > 5) sc.current.hasDragged = true
            const now = performance.now()
            const dx = sc.current.prevX - e.pageX
            const dt = now - sc.current.prevTime
            if (dt > 0) sc.current.velocity = dx / dt
            sc.current.prevX = e.pageX
            sc.current.prevTime = now
            sc.current.offsetX += dx
        }
        const onMouseUp = () => {
            if (!sc.current.isDragging) return
            sc.current.isDragging = false
            if (outerRef.current) outerRef.current.style.cursor = ''
        }
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }
    }, [])

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault() // prevent native image/text drag hijacking mouseup
        sc.current.isDragging = true
        sc.current.hasDragged = false
        sc.current.dragStartX = e.pageX
        sc.current.prevX = e.pageX
        sc.current.prevTime = performance.now()
        sc.current.velocity = 0
        if (outerRef.current) outerRef.current.style.cursor = 'grabbing'
    }

    const onTouchStart = (e: React.TouchEvent) => {
        sc.current.isDragging = true
        sc.current.hasDragged = false
        sc.current.dragStartX = e.touches[0].pageX
        sc.current.prevX = e.touches[0].pageX
        sc.current.prevTime = performance.now()
        sc.current.velocity = 0
    }
    const onTouchMove = (e: React.TouchEvent) => {
        if (!sc.current.isDragging) return
        if (Math.abs(e.touches[0].pageX - sc.current.dragStartX) > 5) sc.current.hasDragged = true
        const now = performance.now()
        const dx = sc.current.prevX - e.touches[0].pageX
        const dt = now - sc.current.prevTime
        if (dt > 0) sc.current.velocity = dx / dt
        sc.current.prevX = e.touches[0].pageX
        sc.current.prevTime = now
        sc.current.offsetX += dx
    }
    const onTouchEnd = () => { sc.current.isDragging = false }

    const navigate = useNavigate()
    const handleImageClick = (src: string) => {
        if (sc.current.hasDragged || !linkTo) return
        scrollToTop()
        navigate(linkTo, { state: { openSrc: src } })
    }

    // Early return after all hooks (Rules of Hooks)
    if (!items.length) return null

    return (
        <div
            ref={outerRef}
            className="overflow-hidden w-full py-2 cursor-grab select-none"
            onMouseDown={onMouseDown}
            onDragStart={e => e.preventDefault()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div
                ref={innerRef}
                className="flex gap-2 w-max"
                style={{ willChange: 'transform' }}
            >
                {doubled.map((item, i) => (
                    linkTo ? (
                        <div key={i} onClick={() => handleImageClick(item.src)}
                            className={`hover-elevate flex-shrink-0 block rounded group hover:scale-[1.02]${showBorder ? ' border-2 border-white' : ''}`}
                        >
                            <div className="overflow-hidden rounded">
                                <img
                                    src={item.src}
                                    alt=""
                                    draggable={false}
                                    className="object-cover block transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                                    style={{ height: `${height}px` }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                                <div className="relative flex flex-col justify-start p-3 text-left text-white">
                                    <h4 className="text-sm font-semibold leading-tight">{item.title}</h4>
                                    {item.description && <p className="text-xs mt-0.5 opacity-80">{item.description}</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div key={i}
                            className={`hover-elevate flex-shrink-0 rounded group hover:scale-[1.02]${showBorder ? ' border-2 border-white' : ''}`}
                        >
                            <div className="overflow-hidden rounded">
                                <img
                                    src={item.src}
                                    alt=""
                                    draggable={false}
                                    className="object-cover block transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                                    style={{ height: `${height}px` }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                                <div className="relative flex flex-col justify-start p-3 text-left text-white">
                                    <h4 className="text-sm font-semibold leading-tight">{item.title}</h4>
                                    {item.description && <p className="text-xs mt-0.5 opacity-80">{item.description}</p>}
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}
