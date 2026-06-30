import { Label } from "@/components/ui/label"

export default function LabelBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Label htmlFor="name">用户名</Label>
      <Label>纯文本标签</Label>
      <Label className="text-destructive">错误状态</Label>
      <Label className="cursor-pointer">
        <input type="checkbox" className="size-3.5" />
        <span>同意条款</span>
      </Label>
    </div>
  )
}
