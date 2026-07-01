"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export type ScrambledTextProps = {
  children: string
  radius?: number
  duration?: number
  speed?: number
  scrambleChars?: string
  className?: string
  style?: React.CSSProperties
}

export function ScrambledText({
  children,
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
}: ScrambledTextProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    if (!rootRef.current) return

    const el = rootRef.current
    const paragraph = el.querySelector("p")
    if (!paragraph) return

    const text = paragraph.textContent || ""
    paragraph.innerHTML = ""
    const chars: HTMLSpanElement[] = []

    for (const char of text) {
      const span = document.createElement("span")
      span.style.display = "inline-block"
      span.style.willChange = "transform"
      span.textContent = char
      span.setAttribute("data-content", char)
      paragraph.appendChild(span)
      chars.push(span)
    }
    charsRef.current = chars

    const scrambles = new Map<number, ReturnType<typeof setTimeout>>()

    const handleMove = (e: PointerEvent) => {
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        const rect = c.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)

        if (dist < radius) {
          if (scrambles.has(i)) continue
          const charDuration = duration * (1 - dist / radius)
          const original = c.getAttribute("data-content") || ""
          const frameInterval = Math.max(30, charDuration * 1000 / 10)
          const totalFrames = Math.max(1, Math.floor((charDuration * 1000) / frameInterval))
          let frame = 0

          const scramble = () => {
            if (frame >= totalFrames) {
              c.textContent = original
              scrambles.delete(i)
              return
            }
            const progress = frame / totalFrames
            if (progress < 0.7) {
              const idx = Math.floor(Math.random() * scrambleChars.length)
              c.textContent = scrambleChars[idx]
            } else {
              c.textContent = original
            }
            frame++
            scrambles.set(i, setTimeout(scramble, frameInterval))
          }
          scramble()
        }
      }
    }

    el.addEventListener("pointermove", handleMove)

    return () => {
      el.removeEventListener("pointermove", handleMove)
      scrambles.forEach((id) => clearTimeout(id))
    }
  }, [radius, duration, speed, scrambleChars])

  return (
    <div
      ref={rootRef}
      data-slot="scrambled-text"
      className={cn(
        "my-[7vw] max-w-[800px] font-mono text-[clamp(14px,4vw,32px)] text-white",
        className
      )}
      style={style}
    >
      <p>{children}</p>
    </div>
  )
}
