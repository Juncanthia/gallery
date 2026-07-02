"use client"

import { cn } from "@/_internals/foundations/utils/cn"

export type GlareHoverProps = {
  width?: string
  height?: string
  background?: string
  borderRadius?: string
  borderColor?: string
  children?: React.ReactNode
  glareColor?: string
  glareOpacity?: number
  glareAngle?: number
  glareSize?: number
  transitionDuration?: number
  playOnce?: boolean
  className?: string
  style?: React.CSSProperties
}

export function GlareHover({
  width = "500px",
  height = "500px",
  background = "#000",
  borderRadius = "10px",
  borderColor = "#333",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {},
}: GlareHoverProps) {
  const hex = glareColor.replace("#", "")
  let rgba = glareColor
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        playOnce && "[&_.glare]:after:animate-none",
        className
      )}
      style={{
        width,
        height,
        background,
        borderRadius,
        borderColor,
        borderWidth: "1px",
        borderStyle: "solid",
        ...style,
      } as React.CSSProperties}
    >
      <div
        className="glare pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(${glareAngle}deg, transparent, ${rgba})`,
          backgroundSize: `${glareSize}% ${glareSize}%`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transition: `opacity ${transitionDuration}ms ease`,
          opacity: 0,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.opacity = "1"
        }}
        onMouseMove={(e) => {
          const el = e.currentTarget
          const rect = el.parentElement!.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          el.style.backgroundPosition = `${x}% ${y}%`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.opacity = "0"
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
