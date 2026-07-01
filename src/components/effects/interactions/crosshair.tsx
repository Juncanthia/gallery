"use client"

import { useEffect, useRef } from "react"

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

const getMousePos = (e: MouseEvent, container: HTMLElement | null) => {
  if (container) {
    const bounds = container.getBoundingClientRect()
    return { x: e.clientX - bounds.left, y: e.clientY - bounds.top }
  }
  return { x: e.clientX, y: e.clientY }
}

export type CrosshairProps = {
  color?: string
  containerRef?: React.RefObject<HTMLElement | null>
}

export function Crosshair({
  color = "white",
  containerRef = null,
}: CrosshairProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const lineHorizontalRef = useRef<HTMLDivElement>(null)
  const lineVerticalRef = useRef<HTMLDivElement>(null)
  const filterXRef = useRef<SVGFETurbulenceElement>(null)
  const filterYRef = useRef<SVGFETurbulenceElement>(null)

  let mouse = { x: 0, y: 0 }

  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      mouse = getMousePos(ev, containerRef?.current ?? null)

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect()
        if (
          ev.clientX < bounds.left ||
          ev.clientX > bounds.right ||
          ev.clientY < bounds.top ||
          ev.clientY > bounds.bottom
        ) {
          if (lineHorizontalRef.current) lineHorizontalRef.current.style.opacity = "0"
          if (lineVerticalRef.current) lineVerticalRef.current.style.opacity = "0"
        } else {
          if (lineHorizontalRef.current) lineHorizontalRef.current.style.opacity = "1"
          if (lineVerticalRef.current) lineVerticalRef.current.style.opacity = "1"
        }
      }
    }

    const target = containerRef?.current ?? window
    target.addEventListener("mousemove", handleMouseMove)

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
    }

    if (lineHorizontalRef.current) lineHorizontalRef.current.style.opacity = "0"
    if (lineVerticalRef.current) lineVerticalRef.current.style.opacity = "0"

    const onMouseMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.x
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.y

      if (lineHorizontalRef.current) {
        lineHorizontalRef.current.style.transition = "opacity 0.9s"
        lineHorizontalRef.current.style.opacity = "1"
      }
      if (lineVerticalRef.current) {
        lineVerticalRef.current.style.transition = "opacity 0.9s"
        lineVerticalRef.current.style.opacity = "1"
      }

      requestAnimationFrame(render)
      target.removeEventListener("mousemove", onMouseMove)
    }

    target.addEventListener("mousemove", onMouseMove)

    const primitiveValues = { turbulence: 0 }

    const enter = () => {
      if (lineHorizontalRef.current)
        lineHorizontalRef.current.style.filter = "url(#filter-noise-x)"
      if (lineVerticalRef.current)
        lineVerticalRef.current.style.filter = "url(#filter-noise-y)"

      // Simple turbulence animation with requestAnimationFrame
      const start = performance.now()
      const anim = (t: number) => {
        const p = Math.max(0, 1 - (t - start) / 500)
        primitiveValues.turbulence = p
        if (filterXRef.current)
          filterXRef.current.setAttribute("baseFrequency", String(p))
        if (filterYRef.current)
          filterYRef.current.setAttribute("baseFrequency", String(p))
        if (p > 0) requestAnimationFrame(anim)
        else {
          if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = "none"
          if (lineVerticalRef.current) lineVerticalRef.current.style.filter = "none"
        }
      }
      requestAnimationFrame(anim)
    }

    const leave = () => {
      if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = "none"
      if (lineVerticalRef.current) lineVerticalRef.current.style.filter = "none"
    }

    const render = () => {
      renderedStyles.tx.current = mouse.x
      renderedStyles.ty.current = mouse.y

      renderedStyles.tx.previous = lerp(
        renderedStyles.tx.previous,
        renderedStyles.tx.current,
        renderedStyles.tx.amt
      )
      renderedStyles.ty.previous = lerp(
        renderedStyles.ty.previous,
        renderedStyles.ty.current,
        renderedStyles.ty.amt
      )

      if (lineVerticalRef.current) {
        lineVerticalRef.current.style.transform = `translateX(${renderedStyles.tx.previous}px)`
      }
      if (lineHorizontalRef.current) {
        lineHorizontalRef.current.style.transform = `translateY(${renderedStyles.ty.previous}px)`
      }

      requestAnimationFrame(render)
    }

    const links = containerRef?.current
      ? containerRef.current.querySelectorAll("a")
      : document.querySelectorAll("a")

    links.forEach((link) => {
      link.addEventListener("mouseenter", enter)
      link.addEventListener("mouseleave", leave)
    })

    return () => {
      target.removeEventListener("mousemove", handleMouseMove)
      target.removeEventListener("mousemove", onMouseMove)
      links.forEach((link) => {
        link.removeEventListener("mouseenter", enter)
        link.removeEventListener("mouseleave", leave)
      })
    }
  }, [containerRef])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none"
      style={{
        position: containerRef ? "absolute" : "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 10000,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves={1}
              ref={filterXRef}
            />
            <feDisplacementMap in="SourceGraphic" scale={40} />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001"
              numOctaves={1}
              ref={filterYRef}
            />
            <feDisplacementMap in="SourceGraphic" scale={40} />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        className="pointer-events-none absolute left-0 h-px w-full"
        style={{ background: color, opacity: 0 }}
      />
      <div
        ref={lineVerticalRef}
        className="pointer-events-none absolute top-0 w-px"
        style={{ background: color, opacity: 0, height: "100%" }}
      />
    </div>
  )
}
