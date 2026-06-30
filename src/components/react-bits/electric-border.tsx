"use client"

import { useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

export type ElectricBorderProps = {
  children?: React.ReactNode
  color?: string
  speed?: number
  chaos?: number
  borderRadius?: number
  className?: string
  style?: React.CSSProperties
}

export function ElectricBorder({
  children,
  color = "#5227FF",
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  style,
}: ElectricBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const lastFrameTimeRef = useRef(0)

  const random = useCallback(
    (x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1,
    []
  )

  const noise2D = useCallback(
    (x: number, y: number) => {
      const i = Math.floor(x)
      const j = Math.floor(y)
      const fx = x - i
      const fy = y - j
      const a = random(i + j * 57)
      const b = random(i + 1 + j * 57)
      const c = random(i + (j + 1) * 57)
      const d = random(i + 1 + (j + 1) * 57)
      const ux = fx * fx * (3.0 - 2.0 * fx)
      const uy = fy * fy * (3.0 - 2.0 * fy)
      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy
    },
    [random]
  )

  const octavedNoise = useCallback(
    (
      x: number,
      octaves: number,
      lacunarity: number,
      gain: number,
      baseAmplitude: number,
      baseFrequency: number,
      time: number,
      seed: number,
      baseFlatness: number
    ) => {
      let y = 0
      let amplitude = baseAmplitude
      let frequency = baseFrequency
      for (let i = 0; i < octaves; i++) {
        let octaveAmplitude = amplitude
        if (i === 0) octaveAmplitude *= baseFlatness
        y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3)
        frequency *= lacunarity
        amplitude *= gain
      }
      return y
    },
    [noise2D]
  )

  const getCornerPoint = useCallback(
    (
      centerX: number,
      centerY: number,
      radius: number,
      startAngle: number,
      arcLength: number,
      progress: number
    ) => {
      const angle = startAngle + progress * arcLength
      return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) }
    },
    []
  )

  const getRoundedRectPoint = useCallback(
    (
      t: number,
      left: number,
      top: number,
      width: number,
      height: number,
      radius: number
    ) => {
      const straightWidth = width - 2 * radius
      const straightHeight = height - 2 * radius
      const cornerArc = (Math.PI * radius) / 2
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc
      const distance = t * totalPerimeter
      let accumulated = 0

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth
        return { x: left + radius + progress * straightWidth, y: top }
      }
      accumulated += straightWidth
      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc
        return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress)
      }
      accumulated += cornerArc
      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight
        return { x: left + width, y: top + radius + progress * straightHeight }
      }
      accumulated += straightHeight
      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc
        return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress)
      }
      accumulated += cornerArc
      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth
        return { x: left + width - radius - progress * straightWidth, y: top + height }
      }
      accumulated += straightWidth
      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc
        return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress)
      }
      accumulated += cornerArc
      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight
        return { x: left, y: top + height - radius - progress * straightHeight }
      }
      accumulated += straightHeight
      const progress = (distance - accumulated) / cornerArc
      return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress)
    },
    [getCornerPoint]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const configOctaves = 10
    const configLacunarity = 1.6
    const configGain = 0.7
    const configAmplitude = chaos
    const configFrequency = 10
    const configBaseFlatness = 0
    const displacement = 60
    const borderOffset = 60

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const width = rect.width + borderOffset * 2
      const height = rect.height + borderOffset * 2
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { width, height }
    }

    let { width, height } = updateSize()
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2)

    const drawElectricBorder = (currentTime: number) => {
      if (!canvas || !ctx) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (dpr !== lastDpr) {
        lastDpr = dpr
        const newSize = updateSize()
        width = newSize.width
        height = newSize.height
      }

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000
      timeRef.current += deltaTime * speed
      lastFrameTimeRef.current = currentTime

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      const left = borderOffset
      const top = borderOffset
      const borderWidth = width - 2 * borderOffset
      const borderHeight = height - 2 * borderOffset
      const maxRadius = Math.min(borderWidth, borderHeight) / 2
      const r = Math.min(borderRadius, maxRadius)
      const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * r
      const sampleCount = Math.floor(approximatePerimeter / 2)

      ctx.beginPath()
      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount
        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, r)

        const xNoise = octavedNoise(
          progress * 8, configOctaves, configLacunarity, configGain,
          configAmplitude, configFrequency, timeRef.current, 0, configBaseFlatness
        )
        const yNoise = octavedNoise(
          progress * 8, configOctaves, configLacunarity, configGain,
          configAmplitude, configFrequency, timeRef.current, 1, configBaseFlatness
        )

        const displacedX = point.x + xNoise * displacement
        const displacedY = point.y + yNoise * displacement

        if (i === 0) ctx.moveTo(displacedX, displacedY)
        else ctx.lineTo(displacedX, displacedY)
      }
      ctx.closePath()
      ctx.stroke()

      animationRef.current = requestAnimationFrame(drawElectricBorder)
    }

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize()
      width = newSize.width
      height = newSize.height
    })
    resizeObserver.observe(container)

    animationRef.current = requestAnimationFrame(drawElectricBorder)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      resizeObserver.disconnect()
    }
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint])

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ borderRadius, ...style }}
    >
      <div className="pointer-events-none absolute inset-[-60px]">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
