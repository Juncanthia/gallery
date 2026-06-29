import { RadioGroup } from "@/components/base/radio-group"
import * as React from "react"

export default function SmartisanRadioExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平单选框 (Standard Flat Radio)
        </h4>
        <RadioGroup
          direction="horizontal"
          defaultValue="A"
          options={[
            { label: "Option A", value: "A" },
            { label: "Option B", value: "B" },
          ]}
        />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化单选框 (Smartisan Skeuomorphic Radio)
        </h4>
        <RadioGroup
          variant="skeuomorphic"
          direction="horizontal"
          defaultValue="A"
          options={[
            { label: "Option A", value: "A" },
            { label: "Option B", value: "B" },
          ]}
        />
      </div>
    </div>
  )
}
