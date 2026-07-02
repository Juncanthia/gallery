"use client"

import { useRef, useEffect } from "react"

export type FadeContentProps = {
  children: React.ReactNode
  container?: string | HTMLElement | null
  blur?: boolean
  duration?: number
  ease?: string
  delay?: number
  threshold?: number
  initialOpacity?: number
  disappearAfter?: number
  disappearDuration?: number
  disappearEase?: string
  onComplete?: () => void
  onDisappearanceComplete?: () => void
  className?: string
  style?: React.CSSProperties
}

export function FadeContent({
  children,
  blur = false,
  duration = 1000,
  ease = "power2.out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power2.in",
  onComplete,
  onDisappearanceComplete,
  className = "",
  style,
  ...props
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const getSeconds = (val: number) => (val > 10 ? val / 1000 : val)

    el.style.opacity = String(initialOpacity)
    el.style.filter = blur ? "blur(10px)" : "blur(0px)"
    el.style.willChange = "opacity, filter"

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = `opacity ${getSeconds(duration)}s ${ease} ${getSeconds(delay)}s, filter ${getSeconds(duration)}s ${ease} ${getSeconds(delay)}s`
          el.style.opacity = "1"
          el.style.filter = "blur(0px)"

          setTimeout(() => {
            if (onComplete) onComplete()
            if (disappearAfter > 0) {
              setTimeout(() => {
                el.style.transition = `opacity ${getSeconds(disappearDuration)}s ${disappearEase}, filter ${getSeconds(disappearDuration)}s ${disappearEase}`
                el.style.opacity = String(initialOpacity)
                el.style.filter = blur ? "blur(10px)" : "blur(0px)"
                setTimeout(() => {
                  if (onDisappearanceComplete) onDisappearanceComplete()
                }, getSeconds(disappearDuration) * 1000)
              }, getSeconds(disappearAfter) * 1000)
            }
          }, (getSeconds(duration) + getSeconds(delay)) * 1000)

          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
     
  }, [])

  return (
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  )
}
