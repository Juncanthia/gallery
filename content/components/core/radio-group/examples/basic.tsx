import { useState } from "react"
import { RadioGroup } from "@/components/core/radio-group"

export default function RadioGroupBasicExample() {
  const [value, setValue] = useState("a")

  return (
    <RadioGroup
      options={[
        { label: "选项 A", value: "a" },
        { label: "选项 B", value: "b" },
        { label: "选项 C（禁用）", value: "c", disabled: true },
      ]}
      value={value}
      onValueChange={setValue}
    />
  )
}
