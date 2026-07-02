"use client"

import { useEffect, useRef, useMemo } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/_internals/foundations/utils/cn"

gsap.registerPlugin(ScrollTrigger)

export type ScrollRevealProps = {
  children: string
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

const DEFAULT_TEXT = "Scroll Reveal"

export function ScrollReveal({
  children = DEFAULT_TEXT,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : ""
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word
      return (
        <span className="word inline-block" key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          ease: "none",
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom",
            end: rotationEnd,
            scrub: true,
          },
        }
      )

      const wordElements = el.querySelectorAll<HTMLElement>(".word")

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      )

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom-=20%",
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ])

  return (
    <h2
      ref={containerRef}
      data-slot="scroll-reveal"
      className={cn("my-5", containerClassName)}
    >
      <p
        className={cn(
          "text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold",
          textClassName
        )}
      >
        {splitText}
      </p>
    </h2>
  )
}
