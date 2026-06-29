import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type GalleryPageProps = {
  children: ReactNode
  className?: string
}

export function GalleryPage({ children, className }: GalleryPageProps) {
  return <main className={cn("w-full pt-1", className)}>{children}</main>
}
