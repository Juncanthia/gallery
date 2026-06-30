import { ScrollArea } from "@/components/ui/scroll-area"

export default function ScrollAreaBasicExample() {
  return (
    <ScrollArea className="h-48 w-full max-w-sm rounded border">
      <div className="space-y-2 p-4">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            第 {i + 1} 行：ScrollArea 在内容溢出时自动显示滚动条。
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
