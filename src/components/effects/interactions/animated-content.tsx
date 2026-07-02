"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export type AnimatedContentProps = {
  children: React.ReactNode
  container?: string | HTMLElement | null
  distance?: number
  direction?: "vertical" | "horizontal"
  reverse?: boolean
  duration?: number
  ease?: string
  initialOpacity?: number
  animateOpacity?: boolean
  scale?: number
  threshold?: number
  delay?: number
  disappearAfter?: number
  disappearDuration?: number
  disappearEase?: string
  onComplete?: () => void
  onDisappearanceComplete?: () => void
  className?: string
}

export function AnimatedContent({
  children,
  container,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power3.in",
  onComplete,
  onDisappearanceComplete,
  className = "",
  ...props
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Simple intersection observer approach as a lightweight alternative to GSAP
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el) {
            el.style.transition = `all ${duration}s ${ease} ${delay}s`
            el.style.transform = "translate(0, 0) scale(1)"
            el.style.opacity = "1"
            el.style.visibility = "visible"
          }
          if (onComplete) setTimeout(onComplete, (duration + delay) * 1000)

          if (disappearAfter > 0) {
            setTimeout(() => {
              if (el) {
                const axis = direction === "horizontal" ? "translateX" : "translateY"
                const offset = reverse ? `${distance}px` : `-${distance}px`
                el.style.transition = `all ${disappearDuration}s ${disappearEase}`
                el.style.transform = `${axis}(${offset}) scale(0.8)`
                el.style.opacity = animateOpacity ? `${initialOpacity}` : "0"
              }
              if (onDisappearanceComplete) {
                setTimeout(onDisappearanceComplete, disappearDuration * 1000)
              }
            }, disappearAfter * 1000)
          }

          observer.unobserve(el)
        }
      },
      { threshold }
    )

        // Set initial state
    const axis = direction === "horizontal" ? "translateX" : "translateY"
    const offset = reverse ? -distance : distance
    el.style.transform = `${axis}(${offset}px) scale(${scale})`
    el.style.opacity = animateOpacity ? `${initialOpacity}` : "1"
    el.style.visibility = "hidden"

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    disappearAfter,
    disappearDuration,
    disappearEase,
    onComplete,
    onDisappearanceComplete,
  ])

  return (
    <div
      ref={ref}
      className={cn("will-change-[transform,opacity]", className)}
      style={{ visibility: "hidden" }}
      {...props}
    >
      {children}
    </div>
  )
}
