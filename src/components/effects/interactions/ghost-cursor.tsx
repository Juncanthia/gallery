"use client"

import { useEffect, useMemo, useRef } from "react"
import { cn } from "@/_internals/foundations/utils/cn"

export type GhostCursorProps = {
  className?: string
  style?: React.CSSProperties
  trailLength?: number
  inertia?: number
  grainIntensity?: number
  bloomStrength?: number
  bloomRadius?: number
  bloomThreshold?: number
  brightness?: number
  color?: string
  mixBlendMode?: string
  edgeIntensity?: number
  maxDevicePixelRatio?: number
  targetPixels?: number
  fadeDelayMs?: number
  fadeDurationMs?: number
  zIndex?: number
}

export function GhostCursor({ className, style, trailLength = 50, inertia = 0.5, grainIntensity = 0.05, brightness = 1, color = "#B497CF", mixBlendMode = "screen", edgeIntensity = 0, maxDevicePixelRatio = 0.5, targetPixels, fadeDelayMs, fadeDurationMs, zIndex = 10 }: GhostCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const trailBufRef = useRef<{ x: number; y: number }[]>([])
  const headRef = useRef(0)
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 })
  const fadeOpacityRef = useRef(1)
  const lastMoveTimeRef = useRef(performance.now())
  const pointerActiveRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const isTouch = useMemo(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    []
  )

  const pixelBudget = targetPixels ?? (isTouch ? 0.9e6 : 1.3e6)
  const fadeDelay = fadeDelayMs ?? (isTouch ? 500 : 1000)
  const fadeDuration = fadeDurationMs ?? (isTouch ? 1000 : 1500)

  useEffect(() => {
    const host = containerRef.current
    const parent = host?.parentElement
    if (!host || !parent) return

    let active = true
    const prevParentPos = parent.style.position
    if (!prevParentPos || prevParentPos === "static") {
      parent.style.position = "relative"
    }

    const canvas = document.createElement("canvas")
    canvas.style.pointerEvents = "none"
    if (mixBlendMode) canvas.style.mixBlendMode = mixBlendMode
    canvas.style.position = "absolute"
    canvas.style.inset = "0"
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    host.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext("2d")
    ctxRef.current = ctx

    const maxTrail = Math.max(1, Math.floor(trailLength))
    trailBufRef.current = Array.from({ length: maxTrail }, () => ({ x: 0.5, y: 0.5 }))
    headRef.current = 0

    const resize = () => {
      if (!active || !ctx) return
      const rect = host.getBoundingClientRect()
      const cssW = Math.floor(rect.width)
      const cssH = Math.floor(rect.height)
      if (cssW <= 0 || cssH <= 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio)
      const currentDpr = Math.min(dpr, Math.sqrt(pixelBudget / (cssW * cssH)))
      canvas.width = Math.floor(cssW * currentDpr)
      canvas.height = Math.floor(cssH * currentDpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
    }

    resize()
    const ro = new ResizeObserver(() => { if (active) resize() })
    ro.observe(parent)
    ro.observe(host)

    const animate = () => {
      if (!active || !ctx || !canvas) return
      const now = performance.now()

      if (pointerActiveRef.current) {
        fadeOpacityRef.current = 1
      } else {
        const dt = now - lastMoveTimeRef.current
        if (dt > fadeDelay) {
          const k = Math.min(1, (dt - fadeDelay) / fadeDuration)
          fadeOpacityRef.current = Math.max(0, 1 - k)
        }
      }

      const N = trailBufRef.current.length
      headRef.current = (headRef.current + 1) % N
      trailBufRef.current[headRef.current] = { ...currentMouseRef.current }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = fadeOpacityRef.current * 0.3

      const w = canvas.width
      const h = canvas.height

      // Draw ghost trail as fading circles
      for (let i = 0; i < N; i++) {
        const idx = (headRef.current - i + N) % N
        const pos = trailBufRef.current[idx]
        if (!pos) continue
        const t = 1 - i / N
        if (t <= 0.01) continue

        const alpha = t * 0.4 * fadeOpacityRef.current
        const px = pos.x * w
        const py = (1 - pos.y) * h
        const radius = 40 + t * 100

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius)
        const c = hexToRgb(color)
        gradient.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha})`)
        gradient.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1

      if (!pointerActiveRef.current && fadeOpacityRef.current <= 0.001) {
        rafRef.current = null
        return
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect()
      currentMouseRef.current = {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width))),
        y: Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / Math.max(1, rect.height))),
      }
      pointerActiveRef.current = true
      lastMoveTimeRef.current = performance.now()
      if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      pointerActiveRef.current = true
      if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
    }
    const onLeave = () => {
      pointerActiveRef.current = false
      lastMoveTimeRef.current = performance.now()
      if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
    }

    parent.addEventListener("pointermove", onMove, { passive: true })
    parent.addEventListener("pointerenter", onEnter, { passive: true })
    parent.addEventListener("pointerleave", onLeave, { passive: true })

    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)

    return () => {
      active = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      parent.removeEventListener("pointermove", onMove)
      parent.removeEventListener("pointerenter", onEnter)
      parent.removeEventListener("pointerleave", onLeave)
      ro.disconnect()
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.parentElement.removeChild(canvasRef.current)
      }
      if (!prevParentPos || prevParentPos === "static") {
        parent.style.position = prevParentPos
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trailLength, inertia, grainIntensity, pixelBudget, fadeDelay, fadeDuration,
    isTouch, color, brightness, mixBlendMode, edgeIntensity,
  ])

  const mergedStyle = useMemo(() => ({ zIndex, ...style }), [zIndex, style])

  return <div ref={containerRef} className={cn("ghost-cursor", className)} style={mergedStyle} />
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace("#", "")
  if (c.length === 3) {
    const r = parseInt(c[0] + c[0], 16)
    const g = parseInt(c[1] + c[1], 16)
    const b = parseInt(c[2] + c[2], 16)
    return { r, g, b }
  }
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return { r, g, b }
}
