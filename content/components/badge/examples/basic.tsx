import { Badge } from "@/components/ui/badge"

export default function BadgeBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>默认</Badge>
      <Badge variant="secondary">次要</Badge>
      <Badge variant="destructive">危险</Badge>
      <Badge variant="outline">边框</Badge>
      <Badge>99+</Badge>
      <Badge variant="secondary" className="rounded-full px-3">圆角</Badge>
    </div>
  )
}
