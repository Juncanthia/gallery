import { useState } from "react"
import { Button } from "@/components/core/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/core/drawer"

export default function DrawerBasicExample() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>打开抽屉</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>抽屉标题</DrawerTitle>
          <DrawerDescription>抽屉的描述信息</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-8">
          <p className="text-sm text-muted-foreground">抽屉的主体内容区域。</p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
