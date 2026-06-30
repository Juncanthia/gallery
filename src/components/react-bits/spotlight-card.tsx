"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"

export type SpotlightCardProps = {
  children?: React.ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = divRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    divRef.current?.style.setProperty("--mouse-x", `${x}px`)
    divRef.current?.style.setProperty("--mouse-y", `${y}px`)
    divRef.current?.style.setProperty("--spotlight-color", spotlightColor)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn("card-spotlight", className)}
    >
      {children}
    </div>
  )
}
