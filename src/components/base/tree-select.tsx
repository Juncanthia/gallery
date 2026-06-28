"use client"

import {
  TreeSelect as TreeSelectBase,
  type TreeSelectProps,
  type TreeSelectOption,
} from "@/components/composite/tree-select"

function TreeSelect(props: TreeSelectProps) {
  return <TreeSelectBase {...props} />
}

export { TreeSelect }
export type { TreeSelectProps, TreeSelectOption }
