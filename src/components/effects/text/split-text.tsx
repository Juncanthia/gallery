"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export type SplitTextProps = {
  text: string
  className?: string
  delay?: number
  duration?: number
  ease?: string
  splitType?: string
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  threshold?: number
  rootMargin?: string
  textAlign?: React.CSSProperties["textAlign"]
  tag?: keyof JSX.IntrinsicElements
  onLetterAnimationComplete?: () => void
}

const DEFAULT_TEXT = "Split Text Animation"

export function SplitText({
  text = DEFAULT_TEXT,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const animationCompletedRef = useRef(false)
  const onCompleteRef = useRef(onLetterAnimationComplete)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete
  }, [onLetterAnimationComplete])

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true)
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true))
    }
  }, [])

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return
      if (animationCompletedRef.current) return

      const el = ref.current

      // Clean up previous split
      const prevInstance = (el as Record<string, unknown>)._rbsplitInstance as
        | { revert: () => void }
        | undefined
      if (prevInstance) {
        try { prevInstance.revert() } catch { /* noop */ }
        ;(el as Record<string, unknown>)._rbsplitInstance = null
      }

      // Manual character/word splitting
      const textContent = el.textContent || ""
      el.innerHTML = ""

      // Split characters into spans
      const chars = Array.from(textContent)
      chars.forEach((char) => {
        const span = document.createElement("span")
        span.className = "split-char"
        span.style.display = "inline-block"
        span.style.willChange = "transform, opacity"
        span.textContent = char === " " ? " " : char
        el.appendChild(span)
      })

      const targets = el.querySelectorAll<HTMLElement>(".split-char")
      if (!targets.length) return

      const startPct = (1 - threshold) * 100
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin)
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px"
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`
      const start = `top ${startPct}%${sign}`

      const ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { ...from },
          {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4,
            },
            onComplete: () => {
              animationCompletedRef.current = true
              onCompleteRef.current?.()
            },
            willChange: "transform, opacity",
            force3D: true,
          }
        )
      }, el)

      const splitInstance = { revert: () => ctx.revert() }
      ;(el as Record<string, unknown>)._rbsplitInstance = splitInstance

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill()
        })
        try { splitInstance.revert() } catch { /* noop */ }
        ;(el as Record<string, unknown>)._rbsplitInstance = null
      }
    },
    {
      dependencies: [
        text, delay, duration, ease, splitType,
        JSON.stringify(from), JSON.stringify(to),
        threshold, rootMargin, fontsLoaded,
      ],
      scope: ref,
    }
  )

  const Tag = tag as keyof JSX.IntrinsicElements

  return (
    <Tag
      ref={ref}
      data-slot="split-text"
      className={cn("split-parent", className)}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
        willChange: "transform, opacity",
      }}
    >
      {text}
    </Tag>
  )
}
