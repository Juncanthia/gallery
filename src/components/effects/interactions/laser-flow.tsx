"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/_internals/foundations/utils/cn"

export type LaserFlowProps = {
  className?: string
  style?: React.CSSProperties
  wispDensity?: number
  dpr?: number
  mouseSmoothTime?: number
  mouseTiltStrength?: number
  horizontalBeamOffset?: number
  verticalBeamOffset?: number
  flowSpeed?: number
  verticalSizing?: number
  horizontalSizing?: number
  fogIntensity?: number
  fogScale?: number
  wispSpeed?: number
  wispIntensity?: number
  flowStrength?: number
  decay?: number
  falloffStart?: number
  fogFallSpeed?: number
  color?: string
}

export function LaserFlow({ className, style, dpr, horizontalBeamOffset = 0.1, verticalSizing = 2.0, horizontalSizing = 0.5, fogIntensity = 0.45, fogScale = 0.3, wispSpeed = 15.0, wispIntensity = 5.0, fogFallSpeed = 0.6, color = "#FF79C6" }: LaserFlowProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    let time = 0
    let fade = 0
    let hasFaded = false
    const mouseTarget = { x: 0, y: 0 }

    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      const pr = Math.min(dpr ?? (window.devicePixelRatio || 1), 2)
      canvas.width = w * pr
      canvas.height = h * pr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseTarget.x = e.clientX - rect.left
      mouseTarget.y = e.clientY - rect.top
    }
    canvas.addEventListener("pointermove", onMove, { passive: true })

    const animate = (_t: number) => {
      if (!ctx) return
      const dt = Math.min(0.033, 0.016)
      time += dt

      if (!hasFaded) {
        fade = Math.min(1, fade + dt / 1.0)
        if (fade >= 1) hasFaded = true
      }

      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = fade * 0.8

      const cx = w * (0.5 + horizontalBeamOffset)
      const cy = h * 0.5
            
      // Draw a stylized laser beam
      const grad = ctx.createLinearGradient(cx - 200, 0, cx + 200, 0)
      const c = hexToRgb(color)
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0)`)
      grad.addColorStop(0.3, `rgba(${c.r},${c.g},${c.b},${0.6 * fade})`)
      grad.addColorStop(0.5, `rgba(${c.r},${c.g},${c.b},${0.9 * fade})`)
      grad.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},${0.6 * fade})`)
      grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)

      ctx.fillStyle = grad
      const beamW = w * horizontalSizing * 2
      const beamH = h * verticalSizing * 0.3
      ctx.fillRect(cx - beamW / 2, cy - beamH / 2, beamW, beamH)

      // Draw wisps
      const wispCount = Math.floor(wispIntensity * 5)
      for (let i = 0; i < wispCount; i++) {
        const wx = cx + Math.sin(time * wispSpeed + i * 2.1) * 100
        const wy = cy + Math.cos(time * wispSpeed * 0.7 + i * 1.3) * 50
        const wr = 2 + Math.sin(time + i) * 3

        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.3 * fade})`
        ctx.beginPath()
        ctx.arc(wx, wy, wr, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw fog effect
      if (fogIntensity > 0) {
        const fogAlpha = fogIntensity * fade * 0.3
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${fogAlpha})`
        for (let i = 0; i < 3; i++) {
          const fx = cx + Math.sin(time * fogFallSpeed + i) * (w * fogScale)
          const fy = cy + Math.cos(time * fogFallSpeed * 0.5 + i) * (h * fogScale * 0.5)
          const fr = 30 + fogScale * 60
          const fgrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr)
          fgrad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${fogAlpha * 0.8})`)
          fgrad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`)
          ctx.fillStyle = fgrad
          ctx.beginPath()
          ctx.arc(fx, fy, fr, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      canvas.removeEventListener("pointermove", onMove)
      if (canvas.parentElement) canvas.parentElement.removeChild(canvas)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dpr])

  return (
    <div
      ref={mountRef}
      className={cn("h-[400px] w-full", className)}
      style={style}
    />
  )
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.trim()
  if (c[0] === "#") c = c.slice(1)
  if (c.length === 3) c = c.split("").map((x) => x + x).join("")
  const n = parseInt(c, 16) || 0xffffff
  return { r: ((n >> 16) & 255), g: ((n >> 8) & 255), b: (n & 255) }
}
