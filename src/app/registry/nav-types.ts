export type GalleryNavItem = {
  id: string
  label: string
  en: string
  to: string
  summary: string
  keywords: string[]
  antd?: boolean
  migration?: number
  api?: boolean
}

export type GalleryNavGroup = {
  group: string
  groupEn: string
  items: GalleryNavItem[]
  libraryId?: string
}

export type GalleryTocItem = {
  id: string
  title: string
  depth: 2 | 3
}

export type GalleryDocMeta = {
  title: string
  en: string
  description: string
  toc: GalleryTocItem[]
}
