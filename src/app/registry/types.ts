export type GalleryItemKind = "component" | "block" | "pattern"

export type GalleryImplementationStatus = "stable" | "beta" | "experimental"

export type GalleryImplementation = {
  source: string
  status?: GalleryImplementationStatus
  importPath?: string
}

export type GalleryItem = {
  id: string
  title: string
  href: string
  kind: GalleryItemKind
  description?: string
  implementations: GalleryImplementation[]
}
