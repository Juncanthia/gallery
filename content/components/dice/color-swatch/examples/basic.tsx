"use client"

import { ColorSwatch } from "@/components/data-display/dice/color-swatch"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ColorSwatch color="#3b82f6" />
      <ColorSwatch color="#10b981" size="sm" />
      <ColorSwatch color="#f59e0b" size="lg" />
      <ColorSwatch color="rgba(239, 68, 68, 0.5)" />
      <ColorSwatch color="#8b5cf6" disabled />
      <ColorSwatch color="transparent" />
    </div>
  )
}
