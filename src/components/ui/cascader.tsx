"use client"

import {
  Cascader as CascaderBase,
  type CascaderProps,
  type CascaderOption,
} from "@/components/blocks/cascader"

function Cascader(props: CascaderProps) {
  return <CascaderBase {...props} />
}

export { Cascader }
export type { CascaderProps, CascaderOption }
