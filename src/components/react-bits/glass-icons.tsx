"use client"

import { cn } from "@/lib/utils"

export type GlassIconsItem = {
  icon: React.ReactNode
  label: string
  color: string
  customClass?: string
}

export type GlassIconsProps = {
  items: GlassIconsItem[]
  className?: string
}

const gradientMapping: Record<string, string> = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
}

export function GlassIcons({ items, className }: GlassIconsProps) {
  const getBackgroundStyle = (color: string) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] }
    }
    return { background: color }
  }

  return (
    <div className={cn("icon-btns", className)}>
      {items.map((item, index) => (
        <button
          key={index}
          className={cn("icon-btn", item.customClass)}
          aria-label={item.label}
          type="button"
        >
          <span className="icon-btn__back" style={getBackgroundStyle(item.color)} />
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">
              {item.icon}
            </span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
