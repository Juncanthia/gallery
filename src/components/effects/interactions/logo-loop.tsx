"use client"

import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react"
import { cn } from "@/_internals/foundations/utils/cn"

type LogoItem =
  | { src: string; srcSet?: string; sizes?: string; width?: number; height?: number; alt?: string; title?: string; href?: string; ariaLabel?: string }
  | { node: React.ReactNode; href?: string; title?: string; ariaLabel?: string }

export type LogoLoopProps = {
  logos: LogoItem[]
  speed?: number
  direction?: "left" | "right" | "up" | "down"
  width?: string | number
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  renderItem?: (item: LogoItem, key: string) => React.ReactNode
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
}

export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Partner logos",
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const isVertical = direction === "up" || direction === "down"

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed
    if (pauseOnHover === true) return 0
    if (pauseOnHover === false) return undefined
    return 0
  }, [hoverSpeed, pauseOnHover])

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed)
    let directionMultiplier: number
    if (isVertical) {
      directionMultiplier = direction === "up" ? 1 : -1
    } else {
      directionMultiplier = direction === "left" ? 1 : -1
    }
    const speedMultiplier = speed < 0 ? -1 : 1
    return magnitude * directionMultiplier * speedMultiplier
  }, [speed, direction, isVertical])

  // Animation
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let offset = 0
    let velocity = 0
    let lastTimestamp: number | null = null
    let raf: number

    const animate = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp
      const deltaTime = Math.max(0, (timestamp - lastTimestamp) / 1000)
      lastTimestamp = timestamp

      const target = isHovered && effectiveHoverSpeed !== undefined ? effectiveHoverSpeed : targetVelocity
      const easingFactor = 1 - Math.exp(-deltaTime / 0.25)
      velocity += (target - velocity) * easingFactor

      offset += velocity * deltaTime
      offset = offset % (logos.length * (logoHeight + gap) * 2)

      const transformValue = isVertical
        ? `translate3d(0, ${-offset}px, 0)`
        : `translate3d(${-offset}px, 0, 0)`
      track.style.transform = transformValue

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [targetVelocity, isHovered, effectiveHoverSpeed, isVertical, logos.length, logoHeight, gap])

  const cssVariables = useMemo(
    () => ({
      "--logoloop-gap": `${gap}px`,
      "--logoloop-logoHeight": `${logoHeight}px`,
      ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
    }),
    [gap, logoHeight, fadeOutColor]
  )

  const toCssLength = (value: string | number) =>
    typeof value === "number" ? `${value}px` : (value ?? undefined)

  const containerStyle = useMemo(
    () => ({
      width: toCssLength(width) ?? "100%",
      ...cssVariables,
      ...style,
    }),
    [width, cssVariables, style]
  )

  const handleMouseEnter = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(true)
  }, [effectiveHoverSpeed])
  const handleMouseLeave = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(false)
  }, [effectiveHoverSpeed])

  const renderLogoItem = useCallback(
    (item: LogoItem, key: string) => {
      if (renderItem) {
        return (
          <li key={key} className="flex shrink-0 items-center">
            {renderItem(item, key)}
          </li>
        )
      }
      const isNodeItem = "node" in item
      const content = isNodeItem ? (
        <span>{item.node}</span>
      ) : (
        <img
          src={item.src}
          alt={item.alt ?? ""}
          className="h-[var(--logoloop-logoHeight)] object-contain"
          style={{ height: `var(--logoloop-logoHeight)` }}
          loading="lazy"
        />
      )
      const itemContent = item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer noopener">
          {content}
        </a>
      ) : content
      return (
        <li key={key} className="flex shrink-0 items-center">
          {itemContent}
        </li>
      )
    },
    [renderItem]
  )

  // Create copies for seamless looping
  const copyCount = 4
  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, i) => (
        <ul
          key={`copy-${i}`}
          className="flex shrink-0 items-center list-none"
          style={{ gap: `var(--logoloop-gap)` }}
          aria-hidden={i > 0}
        >
          {logos.map((item, idx) => renderLogoItem(item, `${i}-${idx}`))}
        </ul>
      )),
    [copyCount, logos, renderLogoItem]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden",
        fadeOut && "relative [&::before]:absolute [&::before]:left-0 [&::before]:top-0 [&::before]:z-10 [&::before]:h-full [&::before]:w-12 [&::before]:bg-gradient-to-r [&::before]:from-[var(--logoloop-fadeColor,white)] [&::after]:absolute [&::after]:right-0 [&::after]:top-0 [&::after]:z-10 [&::after]:h-full [&::after]:w-12 [&::after]:bg-gradient-to-l [&::after]:from-[var(--logoloop-fadeColor,white)]",
        scaleOnHover && "[&_li]:transition-transform [&_li]:hover:scale-110",
        className
      )}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        ref={trackRef}
        className="flex items-center"
        style={{ gap: `var(--logoloop-gap)` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {logoLists}
      </div>
    </div>
  )
})

LogoLoop.displayName = "LogoLoop"
