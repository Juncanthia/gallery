import { useState } from "react"

import { LegacySegmentedControl } from "@/components/_internal/sabraman"

export default function Demo() {
  const [value, setValue] = useState("option1")

  return (
    <div className="flex items-center justify-center p-8">
      <LegacySegmentedControl
        items={[
          { label: "选项一", value: "option1" },
          { label: "选项二", value: "option2" },
          { label: "选项三", value: "option3" },
        ]}
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}
