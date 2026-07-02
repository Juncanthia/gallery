import { useState } from "react"
import { Button } from "@/components/core/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/core/sheet"

export default function SheetBasicExample() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outlined">打开面板</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>面板标题</SheetTitle>
          <SheetDescription>侧边滑出面板的描述</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">面板内容区域。</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
