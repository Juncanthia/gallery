"use client"

import { useRef, useLayoutEffect, useState } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react"
import { cn } from "@/lib/utils"

export type ScrollVelocityProps = {
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  texts?: string[]
  velocity?: number
  className?: string
  damping?: number
  stiffness?: number
  numCopies?: number
  velocityMapping?: { input: [number, number]; output: [number, number] }
  parallaxClassName?: string
  scrollerClassName?: string
  parallaxStyle?: React.CSSProperties
  scrollerStyle?: React.CSSProperties
}

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [ref])

  return width
}

function VelocityText({
  children,
  baseVelocity = 100,
  scrollContainerRef,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}: {
  children: React.ReactNode
  baseVelocity?: number
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  className?: string
  damping?: number
  stiffness?: number
  numCopies?: number
  velocityMapping?: { input: [number, number]; output: [number, number] }
  parallaxClassName?: string
  scrollerClassName?: string
  parallaxStyle?: React.CSSProperties
  scrollerStyle?: React.CSSProperties
}) {
  const baseX = useMotionValue(0)
  const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {}
  const { scrollY } = useScroll(scrollOptions)
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: damping ?? 50,
    stiffness: stiffness ?? 400,
  })
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping?.input || [0, 1000],
    velocityMapping?.output || [0, 5],
    { clamp: false }
  )

  const copyRef = useRef<HTMLSpanElement>(null)
  const copyWidth = useElementWidth(copyRef)

  function wrap(min: number, max: number, v: number) {
    const range = max - min
    const mod = (((v - min) % range) + range) % range
    return mod + min
  }

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px"
    return `${wrap(-copyWidth, 0, v)}px`
  })

  const directionFactor = useRef(1)
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  const spans = []
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className={cn("shrink-0", className)} key={i} ref={i === 0 ? copyRef : null}>
        {children}&nbsp;
      </span>
    )
  }

  return (
    <div
      className={cn("relative overflow-hidden", parallaxClassName)}
      style={parallaxStyle}
    >
      <motion.div
        className={cn(
          "flex whitespace-nowrap text-center font-sans text-2xl font-bold",
          "-tracking-[0.02em] drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]",
          "md:text-5xl md:leading-[5rem]",
          scrollerClassName
        )}
        style={{ x, ...scrollerStyle }}
      >
        {spans}
      </motion.div>
    </div>
  )
}

const DEFAULT_TEXTS = ["Scroll Velocity", "React Bits"]

export function ScrollVelocity({
  scrollContainerRef,
  texts = DEFAULT_TEXTS,
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}: ScrollVelocityProps) {
  return (
    <section data-slot="scroll-velocity">
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}
        </VelocityText>
      ))}
    </section>
  )
}
