import { useState } from "react"
import { Select } from "@/components/ui/select"

export default function SelectBasicExample() {
  const [value, setValue] = useState<string>()
  const [multiValue, setMultiValue] = useState<string[]>()

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">单选</p>
        <Select
          options={[
            { label: "选项一", value: "1" },
            { label: "选项二", value: "2" },
            { label: "选项三（禁用）", value: "3", disabled: true },
          ]}
          placeholder="请选择"
          value={value}
          onValueChange={setValue}
          className="w-44"
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">多选 + 清除</p>
        <Select
          mode="multiple"
          allowClear
          options={[
            { label: "苹果", value: "apple" },
            { label: "香蕉", value: "banana" },
            { label: "橘子", value: "orange" },
            { label: "葡萄", value: "grape" },
          ]}
          placeholder="多选"
          value={multiValue}
          onValueChange={setMultiValue}
          className="w-48"
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">可搜索</p>
        <Select
          showSearch
          options={[
            { label: "北京", value: "beijing" },
            { label: "上海", value: "shanghai" },
            { label: "广州", value: "guangzhou" },
            { label: "深圳", value: "shenzhen" },
          ]}
          placeholder="搜索城市"
          className="w-44"
        />
      </div>
    </div>
  )
}
