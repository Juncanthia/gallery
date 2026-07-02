"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"

// Types
export type MasonryItem = {
  id: string
  img: string
  url: string
  height: number
}

export type MasonryProps = {
  items: MasonryItem[]
  ease?: string
  duration?: number
  stagger?: number
  animateFrom?: "top" | "bottom" | "left" | "right" | "center" | "random"
  scaleOnHover?: boolean
  hoverScale?: number
  blurToFocus?: boolean
  colorShiftOnHover?: boolean
}

// Hooks
function useMedia<T>(queries: string[], values: T[], defaultValue: T): T {
  const get = () => values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue
  const [value, setValue] = useState<T>(get)

  useEffect(() => {
    const handler = () => setValue(get)
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler))
    return () => queries.forEach((q) => matchMedia(q).removeEventListener("change", handler))
  }, [queries])

  return value
}

function useMeasure<T extends HTMLElement>(): [React.RefObject<T | null>, { width: number; height: number }] {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size]
}

async function preloadImages(urls: string[]) {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        })
    )
  )
}

const DEFAULT_ITEMS: MasonryItem[] = [
  { id: "1", img: "https://picsum.photos/seed/1/500/600", url: "#", height: 600 },
  { id: "2", img: "https://picsum.photos/seed/2/500/400", url: "#", height: 400 },
  { id: "3", img: "https://picsum.photos/seed/3/500/500", url: "#", height: 500 },
  { id: "4", img: "https://picsum.photos/seed/4/500/700", url: "#", height: 700 },
  { id: "5", img: "https://picsum.photos/seed/5/500/450", url: "#", height: 450 },
  { id: "6", img: "https://picsum.photos/seed/6/500/550", url: "#", height: 550 },
]

export function Masonry({
  items = DEFAULT_ITEMS,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
}: MasonryProps) {
  const columns = useMedia(
    ["(min-width:1500px)", "(min-width:1000px)", "(min-width:600px)", "(min-width:400px)"],
    [5, 4, 3, 2],
    1
  )

  const [containerRef, { width }] = useMeasure<HTMLDivElement>()
  const [imagesReady, setImagesReady] = useState(false)

  const getInitialPosition = (item: { x: number; y: number }) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return { x: item.x, y: item.y }

    let direction: string = animateFrom
    if (animateFrom === "random") {
      const directions = ["top", "bottom", "left", "right"]
      direction = directions[Math.floor(Math.random() * directions.length)]
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 }
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 }
      case "left":
        return { x: -200, y: item.y }
      case "right":
        return { x: window.innerWidth + 200, y: item.y }
      case "center":
        return { x: containerRect.width / 2 - item.x, y: containerRect.height / 2 - item.y }
      default:
        return { x: item.x, y: item.y + 100 }
    }
  }

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true))
  }, [items])

  const grid = useMemo(() => {
    if (!width) return []
    const colHeights = new Array(columns).fill(0)
    const columnWidth = width / columns

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const h = child.height / 2
      const y = colHeights[col]
      colHeights[col] += h
      return { ...child, x, y, w: columnWidth, h }
    })
  }, [columns, items, width])

  const hasMounted = useRef(false)

  useLayoutEffect(() => {
    if (!imagesReady) return

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`
      const animationProps = { x: item.x, y: item.y, width: item.w, height: item.h }

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item)
        const initialState: gsap.TweenVars = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        }
        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: index * stagger,
        })
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: "auto",
        })
      }
    })
    hasMounted.current = true
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease])

  const handleMouseEnter = (e: React.MouseEvent, item: MasonryItem) => {
    const element = e.currentTarget as HTMLElement
    const selector = `[data-key="${item.id}"]`
    if (scaleOnHover) {
      gsap.to(selector, { scale: hoverScale, duration: 0.3, ease: "power2.out" })
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay")
      if (overlay) {
        gsap.to(overlay, { opacity: 0.3, duration: 0.3 })
      }
    }
  }

  const handleMouseLeave = (e: React.MouseEvent, item: MasonryItem) => {
    const element = e.currentTarget as HTMLElement
    const selector = `[data-key="${item.id}"]`
    if (scaleOnHover) {
      gsap.to(selector, { scale: 1, duration: 0.3, ease: "power2.out" })
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay")
      if (overlay) {
        gsap.to(overlay, { opacity: 0, duration: 0.3 })
      }
    }
  }

  return (
    <div ref={containerRef} className="list">
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="item-wrapper"
          onClick={() => window.open(item.url, "_blank", "noopener")}
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={(e) => handleMouseLeave(e, item)}
        >
          <div className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
            {colorShiftOnHover && (
              <div
                className="color-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))",
                  opacity: 0,
                  pointerEvents: "none" as const,
                  borderRadius: "8px",
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
