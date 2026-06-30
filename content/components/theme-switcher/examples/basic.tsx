"use client"

import { ThemeSwitcher } from "@/components/ui/theme-switcher"

export default function ThemeSwitcherBasicExample() {
  return (
    <div className="flex items-center justify-center p-4">
      <ThemeSwitcher defaultValue="system" />
    </div>
  )
}
