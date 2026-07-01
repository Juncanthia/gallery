"use client"

import { useEffect, useRef } from "react"

export type MagicRingsProps = {
  color?: string
  colorTwo?: string
  speed?: number
  ringCount?: number
  attenuation?: number
  lineThickness?: number
  baseRadius?: number
  radiusStep?: number
  scaleRate?: number
  opacity?: number
  blur?: number
  noiseAmount?: number
  rotation?: number
  ringGap?: number
  fadeIn?: number
  fadeOut?: number
  followMouse?: boolean
  mouseInfluence?: number
  hoverScale?: number
  parallax?: number
  clickBurst?: boolean
}

export function MagicRings({
  color = "#fc42ff",
  colorTwo = "#42fcff",
  speed = 1,
  ringCount = 6,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0.1,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = false,
  mouseInfluence = 0.2,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = false,
}: MagicRingsProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef([0, 0])
  const smoothMouseRef = useRef([0, 0])
  const hoverAmountRef = useRef(0)
  const isHoveredRef = useRef(false)
  const burstRef = useRef(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const canvas = document.createElement("canvas")
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    mount.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    resize()
    window.addEventListener("resize", resize)
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseRef.current[0] = (e.clientX - rect.left) / rect.width - 0.5
      mouseRef.current[1] = -((e.clientY - rect.top) / rect.height - 0.5)
    }
    const onEnter = () => { isHoveredRef.current = true }
    const onLeave = () => {
      isHoveredRef.current = false
      mouseRef.current[0] = 0
      mouseRef.current[1] = 0
    }
    const onClick = () => { burstRef.current = 1 }

    mount.addEventListener("mousemove", onMove)
    mount.addEventListener("mouseenter", onEnter)
    mount.addEventListener("mouseleave", onLeave)
    mount.addEventListener("click", onClick)

    const animate = (t: number) => {
      if (!ctx) return

      smoothMouseRef.current[0] += (mouseRef.current[0] - smoothMouseRef.current[0]) * 0.08
      smoothMouseRef.current[1] += (mouseRef.current[1] - smoothMouseRef.current[1]) * 0.08
      hoverAmountRef.current += ((isHoveredRef.current ? 1 : 0) - hoverAmountRef.current) * 0.08
      burstRef.current *= 0.95
      if (burstRef.current < 0.001) burstRef.current = 0

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const cx = w / 2 + smoothMouseRef.current[0] * w * mouseInfluence * (followMouse ? 1 : 0)
      const cy = h / 2 - smoothMouseRef.current[1] * h * mouseInfluence * (followMouse ? 1 : 0)
      const sc = 1 + (hoverAmountRef.current * (hoverScale - 1)) + burstRef.current * 0.3

      const rcf = Math.max(ringCount - 1, 1)
      const rad = rotation * (Math.PI / 180)
      const unit = Math.min(w, h)

      for (let i = 0; i < ringCount; i++) {
        const fi = i
        const ri = (baseRadius + fi * radiusStep) * unit * sc
        const t0 = i === 0 ? 0 : 2.95 * fi
        const cycleT = (t * 0.001 * speed + t0) % 3.45
        const fade =
          cycleT < fadeIn
            ? cycleT / fadeIn
            : cycleT > fadeOut
              ? 1 - (cycleT - fadeOut) / (3.45 - 0.2 - fadeOut)
              : 1
        if (fade <= 0) continue

        const gap = Math.pow(ringGap, fi)
        const alpha = opacity * fade * 0.5

        // Color interpolation
        const cr = hexToRgb(color)
        const cr2 = hexToRgb(colorTwo)
        const mix = fi / rcf
        const rc = {
          r: cr.r * (1 - mix) + cr2.r * mix,
          g: cr.g * (1 - mix) + cr2.g * mix,
          b: cr.b * (1 - mix) + cr2.b * mix,
        }

        ctx.strokeStyle = `rgba(${rc.r},${rc.g},${rc.b},${alpha})`
        ctx.lineWidth = lineThickness * sc

        // Draw ring with gap
        ctx.beginPath()
        const segments = 200
        for (let j = 0; j <= segments; j++) {
          const ang = -Math.PI / 2 + (j / segments) * Math.PI * 2
          const rr = ri + Math.sin(ang * 3 + t * 0.001) * 2
          const px = cx + Math.cos(ang + rad) * rr
          const py = cy + Math.sin(ang + rad) * rr
          // Gap check
          const angNorm = ((ang % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
          if (gap < 1 && angNorm > Math.PI * (1 - gap)) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }
        ctx.stroke()
      }

      // Noise overlay
      if (noiseAmount > 0) {
        const imageData = ctx.getImageData(0, 0, w, h)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const n = (Math.random() - 0.5) * noiseAmount * 255
          data[i] += n
          data[i + 1] += n
          data[i + 2] += n
        }
        ctx.putImageData(imageData, 0, 0)
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      ro.disconnect()
      mount.removeEventListener("mousemove", onMove)
      mount.removeEventListener("mouseenter", onEnter)
      mount.removeEventListener("mouseleave", onLeave)
      mount.removeEventListener("click", onClick)
      if (canvas.parentElement) canvas.parentElement.removeChild(canvas)
    }
  }, [
    color, colorTwo, speed, ringCount, attenuation, lineThickness,
    baseRadius, radiusStep, scaleRate, opacity, noiseAmount,
    rotation, ringGap, fadeIn, fadeOut, followMouse, mouseInfluence,
    hoverScale, parallax, clickBurst,
  ])

  return (
    <div
      ref={mountRef}
      className="magic-rings-container h-[400px] w-full"
      style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
    />
  )
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace("#", "")
  if (c.length === 3) {
    return {
      r: parseInt(c[0] + c[0], 16),
      g: parseInt(c[1] + c[1], 16),
      b: parseInt(c[2] + c[2], 16),
    }
  }
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  }
}
