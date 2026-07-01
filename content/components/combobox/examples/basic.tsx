import { Combobox, type ComboboxOption } from "@/components/ui/combobox"

const options: ComboboxOption[] = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
]

export default function Cb() {
  return (
    <Combobox
      className="w-48"
      options={options}
      placeholder="选择或搜索..."
      searchPlaceholder="输入关键词..."
    />
  )
}
