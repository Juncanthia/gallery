"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, useMotionValue, useAnimationFrame, useTransform, type MotionStyle } from "motion/react"
import { cn } from "@/_internals/foundations/utils/cn"

export type GradientTextProps = {
  children: React.ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
  direction?: "horizontal" | "vertical" | "diagonal"
  pauseOnHover?: boolean
  yoyo?: boolean
}

export function GradientText({
  children,
  className = "",
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false)
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)

  const animationDuration = animationSpeed * 1000

  useAnimationFrame((time) => {
    if (isPaused) {
      lastTimeRef.current = null
      return
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
      return
    }

    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time
    elapsedRef.current += deltaTime

    if (yoyo) {
      const fullCycle = animationDuration * 2
      const cycleTime = elapsedRef.current % fullCycle

      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100)
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100)
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100)
    }
  })

  useEffect(() => {
    elapsedRef.current = 0
    progress.set(0)
  }, [animationSpeed, progress, yoyo])

  const backgroundPosition = useTransform(progress, (p) => {
    if (direction === "horizontal") return `${p}% 50%`
    if (direction === "vertical") return `50% ${p}%`
    return `${p}% 50%`
  })

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true)
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false)
  }, [pauseOnHover])

  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right"

  const gradientColors = [...colors, colors[0]].join(", ")

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === "horizontal"
        ? "300% 100%"
        : direction === "vertical"
          ? "100% 300%"
          : "300% 300%",
    backgroundRepeat: "repeat",
  }

  return (
    <motion.div
      data-slot="gradient-text"
      className={cn(
        "relative mx-auto flex max-w-fit flex-row items-center justify-center",
        "rounded-xl font-medium backdrop-blur-sm overflow-hidden cursor-pointer",
        "transition-[box-shadow] duration-500 ease-out",
        showBorder && "px-3 py-1.5",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] z-0 pointer-events-none
            before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
            before:w-[calc(100%-2px)] before:h-[calc(100%-2px)] before:rounded-[inherit] before:bg-[#120F17] before:-z-10"
          style={{ ...gradientStyle, backgroundPosition }}
        />
      )}
      <motion.div
        className="relative z-[2] inline-block bg-clip-text text-transparent"
        style={{
          ...gradientStyle,
          backgroundPosition,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        } as MotionStyle}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
