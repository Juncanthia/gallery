"use client"

import { ThemeSwitcher } from "@/components/blocks/theme-switcher"

export default function ThemeSwitcherBasicExample() {
  return (
    <div className="flex items-center justify-center p-4">
      <ThemeSwitcher defaultValue="system" />
    </div>
  )
}
