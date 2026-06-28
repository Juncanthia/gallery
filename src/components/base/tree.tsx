"use client"

import {
  TreeProvider,
  type TreeProviderProps,
} from "@/components/composite/tree"

function Tree(props: TreeProviderProps) {
  return <TreeProvider {...props} />
}

export { Tree }
export type { TreeProviderProps as TreeProps }
