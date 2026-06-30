"use client"

import { cn } from "@/lib/utils"

export type GlassSurfaceProps = {
  children?: React.ReactNode
  width?: number | string
  height?: number | string
  borderRadius?: number
  borderWidth?: number
  brightness?: number
  opacity?: number
  blur?: number
  displace?: number
  backgroundOpacity?: number
  saturation?: number
  distortionScale?: number
  redOffset?: number
  greenOffset?: number
  blueOffset?: number
  xChannel?: "R" | "G" | "B" | "A"
  yChannel?: "R" | "G" | "B" | "A"
  mixBlendMode?: string
  className?: string
  style?: React.CSSProperties
}

function supportsSVGFilters() {
  if (typeof window === "undefined") return false
  const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  const isFirefox = /Firefox/.test(navigator.userAgent)
  if (isWebkit || isFirefox) return false
  const div = document.createElement("div")
  div.style.backdropFilter = "url(#test)"
  return div.style.backdropFilter !== ""
}

export function GlassSurface({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
  className = "",
  style = {},
}: GlassSurfaceProps) {
  const uniqueId = cn
  const filterId = `glass-filter-${Math.random().toString(36).slice(2)}`
  const redGradId = `red-grad-${filterId}`
  const blueGradId = `blue-grad-${filterId}`

  const svgSupported = supportsSVGFilters()

  const containerStyle: React.CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    "--glass-frost": backgroundOpacity,
    "--glass-saturation": saturation,
    "--filter-id": `url(#${filterId})`,
  } as React.CSSProperties

  const edgeSize = Math.min(
    typeof width === "number" ? width : 200,
    typeof height === "number" ? height : 80
  ) * (borderWidth * 0.5)

  const svgContent = `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${redGradId})"/>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode:${mixBlendMode}"/>
      <rect x="${edgeSize}" y="${edgeSize}" width="${Number(width)! - edgeSize * 2}" height="${Number(height)! - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
    </svg>
  `
  const displacementMap = `data:image/svg+xml,${encodeURIComponent(svgContent)}`

  return (
    <div
      className={cn(
        "glass-surface",
        svgSupported ? "glass-surface--svg" : "glass-surface--fallback",
        className
      )}
      style={containerStyle}
    >
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
              href={displacementMap}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={(distortionScale + redOffset).toString()}
              xChannelSelector={xChannel}
              yChannelSelector={yChannel}
              result="dispRed"
            />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={(distortionScale + greenOffset).toString()}
              xChannelSelector={xChannel}
              yChannelSelector={yChannel}
              result="dispGreen"
            />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={(distortionScale + blueOffset).toString()}
              xChannelSelector={xChannel}
              yChannelSelector={yChannel}
              result="dispBlue"
            />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation={displace.toString()} />
          </filter>
        </defs>
      </svg>
      <div className="glass-surface__content">{children}</div>
    </div>
  )
}
