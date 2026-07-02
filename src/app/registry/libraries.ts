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
    id: "bklit-ui",
    label: "BKLit Charts",
    labelEn: "BKLit Charts",
    routePrefix: "/components/bklit",
    hasBlocks: false,
  },
  {
    id: "animateui",
    label: "Animate UI",
    labelEn: "Animate UI",
    routePrefix: "/components/animateui",
    hasBlocks: false,
  },
  {
    id: "chamaac-ui",
    label: "Chamaac",
    labelEn: "Chamaac",
    routePrefix: "/components/chamaac",
    hasBlocks: false,
  },
  {
    id: "blocks/data-table-filters",
    label: "Table Filters",
    labelEn: "Table Filters",
    routePrefix: "/components/dt",
    hasBlocks: false,
  },
  {
    id: "dice-ui",
    label: "Dice UI",
    labelEn: "Dice UI",
    routePrefix: "/components/dice",
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
    id: "extend-ui",
    label: "Extend",
    labelEn: "Extend",
    routePrefix: "/components/extend",
    hasBlocks: false,
  },
  {
    id: "gooseui",
    label: "Goose UI",
    labelEn: "Goose UI",
    routePrefix: "/components/gooseui",
    hasBlocks: false,
  },
  {
    id: "limeplay",
    label: "Limeplay",
    labelEn: "Limeplay",
    routePrefix: "/components/limeplay",
    hasBlocks: false,
  },
  {
    id: "manifest-ui",
    label: "Manifest",
    labelEn: "Manifest",
    routePrefix: "/components/manifest",
    hasBlocks: false,
  },
  {
    id: "patterns",
    label: "Patterns",
    labelEn: "Patterns",
    routePrefix: "/components/patterns",
    hasBlocks: false,
  },
  {
    id: "plate",
    label: "Plate",
    labelEn: "Plate",
    routePrefix: "/components/plate",
    hasBlocks: false,
  },
  {
    id: "sabraman",
    label: "Sabraman",
    labelEn: "Sabraman",
    routePrefix: "/components/sabraman",
    hasBlocks: false,
  },
  {
    id: "tool-ui",
    label: "Tool UI",
    labelEn: "Tool UI",
    routePrefix: "/components/tool",
    hasBlocks: false,
  },
  {
    id: "uselayouts",
    label: "UseLayouts",
    labelEn: "UseLayouts",
    routePrefix: "/components/uselayouts",
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
