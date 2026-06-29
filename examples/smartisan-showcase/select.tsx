import { Select } from "@/components/base/select"
import * as React from "react"

export default function SmartisanSelectExample() {
  const options = [
    { label: "北京 (Beijing)", value: "beijing" },
    { label: "上海 (Shanghai)", value: "shanghai" },
    { label: "深圳 (Shenzhen)", value: "shenzhen" },
    { label: "成都 (Chengdu)", value: "chengdu" },
  ]

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平下拉选择器 (Standard Flat Select)
        </h4>
        <div className="max-w-xs">
          <Select placeholder="请选择城市..." options={options} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化下拉选择器 (Smartisan Skeuomorphic Select)
        </h4>
        <div className="max-w-xs">
          <Select variant="skeuomorphic" placeholder="请选择城市 (微渐变与实体感)..." options={options} />
        </div>
      </div>
    </div>
  )
}
