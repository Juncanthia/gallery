import { AutoComplete } from "@/components/ui/auto-complete"
export default function Ac() {
  return <AutoComplete options={[{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }, { label: "Orange", value: "orange" }]} placeholder="搜索..." className="w-48" />
}
