import { Checkbox } from "@/components/ui/gooseui-checkbox"

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="默认复选框" />
      <Checkbox label="已选中" defaultChecked />
      <Checkbox label="禁用未选" disabled />
      <Checkbox label="禁用已选" disabled defaultChecked />
    </div>
  )
}
