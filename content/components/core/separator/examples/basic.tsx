import { Separator } from "@/components/core/separator"

export default function SeparatorBasicExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div>
        <p className="text-sm">上方内容</p>
        <Separator className="my-2" />
        <p className="text-sm">下方内容</p>
      </div>

      <div className="flex h-8 items-center gap-2">
        <span className="text-sm">左</span>
        <Separator orientation="vertical" />
        <span className="text-sm">中</span>
        <Separator orientation="vertical" />
        <span className="text-sm">右</span>
      </div>
    </div>
  )
}
