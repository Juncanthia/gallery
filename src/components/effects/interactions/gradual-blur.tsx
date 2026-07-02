"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { cn } from "@/lib/utils"

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) =>
    p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
}

const PRESETS: Record<string, Record<string, unknown>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": { position: "top", height: "10rem", target: "page", strength: 3 },
  "page-footer": { position: "bottom", height: "10rem", target: "page", strength: 3 },
}

type GradualBlurConfig = {
  position?: string
  strength?: number
  height?: string
  divCount?: number
  exponential?: boolean
  zIndex?: number
  animated?: boolean | string
  duration?: string
  easing?: string
  opacity?: number
  curve?: string
  responsive?: boolean
  target?: string
  className?: string
  style?: React.CSSProperties
  hoverIntensity?: number
  preset?: string
  onAnimationComplete?: () => void
  width?: string
}

function GradualBlur(props: GradualBlurConfig) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {}
    return {
      position: "bottom",
      strength: 2,
      height: "6rem",
      divCount: 5,
      exponential: false,
      zIndex: 1000,
      animated: false,
      duration: "0.3s",
      easing: "ease-out",
      opacity: 1,
      curve: "linear",
      responsive: false,
      target: "parent",
      className: "",
      style: {},
      ...presetConfig,
      ...props,
    } as GradualBlurConfig & { position: string; strength: number; height: string; divCount: number; opacity: number; exponential: boolean; curve: string; zIndex: number }
  }, [props])

  const [isVisible, setIsVisible] = useState(config.animated !== "scroll")

  useEffect(() => {
    if (config.animated !== "scroll" || !containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [config.animated])

  useEffect(() => {
    if (isVisible && config.animated === "scroll" && config.onAnimationComplete) {
      const ms = parseFloat(config.duration!) * 1000
      const t = setTimeout(() => config.onAnimationComplete?.(), ms)
      return () => clearTimeout(t)
    }
  }, [isVisible, config.animated, config.onAnimationComplete, config.duration])

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = []
    const increment = 100 / config.divCount
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength

    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear

    for (let i = 1; i <= config.divCount; i++) {
      let progress = i / config.divCount
      progress = curveFunc(progress)

      let blurValue: number
      if (config.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength
      } else {
        blurValue = 0.0625 * (progress * config.divCount + 1) * currentStrength
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10
      const p2 = Math.round(increment * i * 10) / 10
      const p3 = Math.round((increment * i + increment) * 10) / 10
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10

      let gradient = `transparent ${p1}%, black ${p2}%`
      if (p3 <= 100) gradient += `, black ${p3}%`
      if (p4 <= 100) gradient += `, transparent ${p4}%`

      const directionMap: Record<string, string> = {
        top: "to top",
        bottom: "to bottom",
        left: "to left",
        right: "to right",
      }
      const direction = directionMap[config.position] || "to bottom"

      const divStyle: React.CSSProperties = {
        position: "absolute",
        inset: "0",
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined,
      }

      divs.push(<div key={i} style={divStyle} />)
    }

    return divs
  }, [config, isHovered])

  const isPageTarget = config.target === "page"
  const isVertical = ["top", "bottom"].includes(config.position)
  const isHorizontal = ["left", "right"].includes(config.position)

  const containerStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    }

    if (isVertical) {
      base.height = config.height
      base.width = (config.width) || "100%"
      base[config.position as "top" | "bottom" | "left" | "right"] = 0
      if (config.position === "top" || config.position === "bottom") {
        base.left = 0
        base.right = 0
      }
    } else if (isHorizontal) {
      base.width = config.width || config.height
      base.height = "100%"
      base[config.position as "top" | "bottom" | "left" | "right"] = 0
      base.top = 0
      base.bottom = 0
    }

    return base
  }, [config, isVisible, isVertical, isHorizontal, isPageTarget])

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none",
        config.target === "page" ? "fixed" : "absolute",
        config.className
      )}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="relative h-full w-full">{blurDivs}</div>
    </div>
  )
}

const GradualBlurMemo = React.memo(GradualBlur)
GradualBlurMemo.displayName = "GradualBlur"

export { GradualBlurMemo as GradualBlur }
export type { GradualBlurConfig as GradualBlurProps }
