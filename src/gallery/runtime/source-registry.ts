// 组件源码直接导入，不走 import.meta.glob（更可靠）
import buttonTsx from "../../../src/components/base/button.tsx?raw"
import buttonVariants from "../../../src/components/base/button-variants.ts?raw"
import buttonGroup from "../../../src/components/base/button-group.tsx?raw"

export type ComponentSourceFile = {
  name: string
  source: string
}

const SOURCES: Record<string, ComponentSourceFile[]> = {
  button: [
    { name: "button.tsx", source: buttonTsx },
    { name: "button-variants.ts", source: buttonVariants },
    { name: "button-group.tsx", source: buttonGroup },
  ],
}

export function getComponentSources(componentId: string): ComponentSourceFile[] {
  return SOURCES[componentId] ?? []
}
