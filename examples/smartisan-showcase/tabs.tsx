import { Tabs } from "@/components/base/tabs"
import * as React from "react"

export default function SmartisanTabsExample() {
  const items = [
    { key: "beijing", label: "北京", children: <div className="p-4 text-sm text-muted-foreground">北京是中国的首都，拥有悠久的历史和深厚的文化底蕴。</div> },
    { key: "shanghai", label: "上海", children: <div className="p-4 text-sm text-muted-foreground">上海是国际金融中心，充满活力与现代都市气息。</div> },
    { key: "shenzhen", label: "深圳", children: <div className="p-4 text-sm text-muted-foreground">深圳是中国改革开放的前沿，科技创新之都。</div> },
  ]

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平分段控制器 (Standard Flat Tabs)
        </h4>
        <div className="max-w-md">
          <Tabs items={items} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化分段控制器 (Smartisan Skeuomorphic Tabs)
        </h4>
        <div className="max-w-md">
          <Tabs variant="skeuomorphic" items={items} />
        </div>
      </div>
    </div>
  )
}
