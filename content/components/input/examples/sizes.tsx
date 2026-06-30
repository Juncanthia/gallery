import { Input } from "@/components/ui/input"

export default function InputSizesExample() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">small</p>
        <Input size="small" placeholder="小尺寸" className="w-36" />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">middle（默认）</p>
        <Input size="middle" placeholder="中尺寸" className="w-44" />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">large</p>
        <Input size="large" placeholder="大尺寸" className="w-52" />
      </div>
    </div>
  )
}
