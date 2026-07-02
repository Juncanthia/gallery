import { useState } from "react"
import { Checkbox, CheckboxGroup } from "@/components/core/checkbox"

export default function CheckboxBasicExample() {
  const [checked, setChecked] = useState(false)
  const [groupValue, setGroupValue] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox checked={checked} onChange={setChecked} label="同意条款" />
        <Checkbox defaultChecked label="默认选中" />
        <Checkbox disabled label="禁用选项" />
      </div>
      <CheckboxGroup
        options={[
          { label: "选项 A", value: "a" },
          { label: "选项 B", value: "b" },
          { label: "选项 C", value: "c" },
        ]}
        value={groupValue}
        onValueChange={setGroupValue}
      />
    </div>
  )
}
