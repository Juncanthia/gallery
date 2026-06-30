import { Combobox } from "@/components/ui/combobox"
export default function Cb() {
  return <Combobox options={[{ label: "选项一", value: "1" }, { label: "选项二", value: "2" }, { label: "选项三", value: "3" }]} placeholder="选择或搜索..." className="w-48" />
}
