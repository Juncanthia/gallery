"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export type TrueFocusProps = {
  sentence?: string
  separator?: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  className?: string
}

const DEFAULT_SENTENCE = "True Focus"

export function TrueFocus({
  sentence = DEFAULT_SENTENCE,
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = "",
}: TrueFocusProps) {
  const words = sentence.split(separator)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length)
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      )
      return () => clearInterval(interval)
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length])

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return
    if (!wordRefs.current[currentIndex] || !containerRef.current) return

    const parentRect = containerRef.current.getBoundingClientRect()
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect()

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    })
  }, [currentIndex, words.length])

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index)
      setCurrentIndex(index)
    }
  }

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex!)
    }
  }

  const cornerBase =
    "absolute w-4 h-4 border-[3px] rounded-[3px] transition-none"
  const cornerStyle = {
    borderColor: `var(--border-color, ${borderColor})`,
    filter: `drop-shadow(0px 0px 4px var(--border-color, ${borderColor}))`,
  } as React.CSSProperties

  return (
    <div
      ref={containerRef}
      data-slot="true-focus"
      className={cn(
        "relative flex gap-[1em] justify-center items-center flex-wrap outline-none select-none",
        className
      )}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex
        return (
          <span
            key={index}
            ref={(el) => { wordRefs.current[index] = el }}
            className={cn(
              "relative text-5xl font-black cursor-pointer outline-none select-none",
              "transition-[filter,color] duration-300 ease-out",
              manualMode ? "" : isActive ? "blur-[0px]" : ""
            )}
            style={
              {
                filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
                "--border-color": borderColor,
                "--glow-color": glowColor,
                transition: `filter ${animationDuration}s ease`,
              } as React.CSSProperties
            }
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        )
      })}

      <motion.div
        className="absolute top-0 left-0 pointer-events-none box-content border-none"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: animationDuration }}
        style={
          {
            "--border-color": borderColor,
            "--glow-color": glowColor,
          } as React.CSSProperties
        }
      >
        <span
          className={cn(cornerBase, "top-[-10px] left-[-10px] border-r-0 border-b-0")}
          style={cornerStyle}
        />
        <span
          className={cn(cornerBase, "top-[-10px] right-[-10px] border-l-0 border-b-0")}
          style={cornerStyle}
        />
        <span
          className={cn(cornerBase, "bottom-[-10px] left-[-10px] border-r-0 border-t-0")}
          style={cornerStyle}
        />
        <span
          className={cn(cornerBase, "bottom-[-10px] right-[-10px] border-l-0 border-t-0")}
          style={cornerStyle}
        />
      </motion.div>
    </div>
  )
}
