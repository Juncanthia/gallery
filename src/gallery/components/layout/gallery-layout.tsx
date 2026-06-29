import type { ReactNode } from "react"

import {
  galleryItemCount,
  gallerySearchEntries,
  GALLERY_NAV_GROUPS,
} from "../../catalog"
import { GalleryShell } from "./shell/gallery-shell"

export type GalleryCounts = {
  components: number
  blocks: number
  patterns: number
}

type GalleryDocsLayoutProps = {
  children?: ReactNode
}

const GLOBAL_SEARCH_ENTRIES = [
  {
    id: "components",
    name: "components",
    label: "组件",
    en: "Components",
    group: "全局",
    groupEn: "Global",
    to: "/components/button",
    summary: "浏览全部 UI 组件",
    keywords: ["components", "组件", "zj"],
  },
]

function getGalleryItemCounts(): GalleryCounts {
  return {
    components: galleryItemCount,
    blocks: 0,
    patterns: 0,
  }
}

export function GalleryDocsLayout({ children }: GalleryDocsLayoutProps) {
  return (
    <GalleryShell
      counts={getGalleryItemCounts()}
      globalSearchEntries={GLOBAL_SEARCH_ENTRIES}
      navGroups={GALLERY_NAV_GROUPS}
      searchEntries={gallerySearchEntries}
    >
      {children}
    </GalleryShell>
  )
}
