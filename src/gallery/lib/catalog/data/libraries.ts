export type GalleryLibrary = {
  id: string
  sourceId: string
  sidebarName: string
  codeTransform: {
    rules: Array<{
      from: string
      to: string
    }>
  }
}

export const GALLERY_LIBRARIES: GalleryLibrary[] = [
  {
    id: "local",
    sourceId: "local",
    sidebarName: "本地组件库",
    codeTransform: {
      rules: [
        {
          from: "src/components/",
          to: "@/components/",
        },
      ],
    },
  },
]

export function libraryBySourceId(sourceId: string) {
  return GALLERY_LIBRARIES.find((library) => library.sourceId === sourceId)
}
