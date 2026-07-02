import { NativeSelect, NativeSelectOption } from "@/components/core/native-select"

export default function NativeSelectBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <NativeSelect className="w-44">
        <NativeSelectOption value="">请选择</NativeSelectOption>
        <NativeSelectOption value="1">选项一</NativeSelectOption>
        <NativeSelectOption value="2">选项二</NativeSelectOption>
        <NativeSelectOption value="3" disabled>选项三（禁用）</NativeSelectOption>
      </NativeSelect>

      <NativeSelect disabled className="w-44">
        <NativeSelectOption value="">禁用状态</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
