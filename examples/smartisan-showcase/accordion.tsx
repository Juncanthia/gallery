import { Accordion } from "@/components/base/accordion"
import * as React from "react"

export default function SmartisanAccordionExample() {
  const items = [
    { key: "1", label: "关于 Smartisan OS", children: "Smartisan OS 是锤子科技开发的基于 Android 的深度定制操作系统，以其极高的美学追求和拟物化设计著称。" },
    { key: "2", label: "拟物化设计宣言", children: "我们相信，向物理世界学习能带来最直观、最温暖、最富有情感的交互体验。拟物化不是落后，而是对细节的极致尊重。" },
    { key: "3", label: "微渐变与内高光", children: "通过精细的微渐变、多层漫反射阴影和内高光，我们为数字界面赋予了真实的物理厚度和触感。" },
  ]

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平折叠面板 (Standard Flat Accordion)
        </h4>
        <div className="max-w-md">
          <Accordion items={items} accordion />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化折叠面板 (Smartisan Skeuomorphic Accordion)
        </h4>
        <div className="max-w-md">
          <Accordion variant="skeuomorphic" items={items} accordion />
        </div>
      </div>
    </div>
  )
}
