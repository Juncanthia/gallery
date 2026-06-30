import { useState } from "react"
import { Select } from "@/components/ui/select"

export default function SelectGroupsExample() {
  const [value, setValue] = useState<string>()
  const [size, setSize] = useState<string>()

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">分组选项</p>
        <Select
          options={[
            {
              label: "水果",
              options: [
                { label: "苹果", value: "apple" },
                { label: "香蕉", value: "banana" },
              ],
            },
            {
              label: "蔬菜",
              options: [
                { label: "白菜", value: "cabbage" },
                { label: "萝卜", value: "radish" },
              ],
            },
          ]}
          placeholder="选择食物"
          value={value}
          onValueChange={setValue}
          className="w-44"
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">不同尺寸</p>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            size="small"
            options={[
              { label: "小尺寸", value: "s" },
              { label: "中尺寸", value: "m" },
            ]}
            placeholder="小"
            value={size}
            onValueChange={setSize}
            className="w-32"
          />
          <Select
            size="large"
            options={[
              { label: "大尺寸一", value: "l1" },
              { label: "大尺寸二", value: "l2" },
            ]}
            placeholder="大"
            className="w-40"
          />
        </div>
      </div>
    </div>
  )
}
