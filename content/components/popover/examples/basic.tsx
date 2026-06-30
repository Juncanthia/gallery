import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export default function PopoverBasicExample() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outlined">打开气泡</Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">气泡标题</h4>
          <p className="text-sm text-muted-foreground">气泡卡片的内容区域，可放置任意内容。</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
