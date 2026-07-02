import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/core/dialog"
import { Button } from "@/components/core/button"

export default function DialogBasicExample() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>打开对话框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认操作</DialogTitle>
          <DialogDescription>
            确定要执行此操作吗？此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outlined" onClick={() => setOpen(false)}>取消</Button>
          <Button color="primary" variant="solid" onClick={() => setOpen(false)}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
