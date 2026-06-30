import type { GalleryNavGroup } from "./catalog"

export type Library = {
  id: string
  label: string
  labelEn: string
  /** 组件详情页路由前缀，如 "/components" */
  routePrefix: string
  /** 是否包含 Blocks（复合组件）tab */
  hasBlocks: boolean
}

export const LIBRARIES: Library[] = [
  {
    id: "kibo-ui",
    label: "主库",
    labelEn: "Main",
    routePrefix: "/components",
    hasBlocks: true,
  },
  {
    id: "react-bits",
    label: "React Bits",
    labelEn: "React Bits",
    routePrefix: "/components/rb",
    hasBlocks: false,
  },
  {
    id: "evilcharts",
    label: "EvilCharts",
    labelEn: "EvilCharts",
    routePrefix: "/components/evilcharts",
    hasBlocks: false,
  },
  {
    id: "animateui",
    label: "Animate UI",
    labelEn: "Animate UI",
    routePrefix: "/components/animateui",
    hasBlocks: false,
  },
]

export function getLibraryById(id: string): Library | undefined {
  return LIBRARIES.find((lib) => lib.id === id)
}

export function getFilteredGroups(
  groups: GalleryNavGroup[],
  libraryId: string
): GalleryNavGroup[] {
  return groups.filter((g) => g.libraryId === libraryId)
}
