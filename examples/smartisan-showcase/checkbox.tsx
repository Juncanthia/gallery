import { Checkbox, CheckboxGroup } from "@/components/base/checkbox"
import * as React from "react"

export default function SmartisanCheckboxExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平多选框 (Standard Flat Checkbox)
        </h4>
        <div className="flex flex-wrap gap-6">
          <Checkbox defaultChecked>Option A</Checkbox>
          <Checkbox>Option B</Checkbox>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化多选框 (Smartisan Skeuomorphic Checkbox)
        </h4>
        <div className="flex flex-wrap gap-6">
          <Checkbox variant="skeuomorphic" defaultChecked>Option A</Checkbox>
          <Checkbox variant="skeuomorphic">Option B</Checkbox>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          拟物化多选框组 (Skeuomorphic Checkbox Group)
        </h4>
        <CheckboxGroup
          variant="skeuomorphic"
          defaultValue={["A", "C"]}
          options={[
            { label: "选项 A", value: "A" },
            { label: "选项 B", value: "B" },
            { label: "选项 C", value: "C" },
          ]}
        />
      </div>
    </div>
  )
}
