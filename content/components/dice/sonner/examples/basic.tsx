"use client"

import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toaster />
      <Button
        color="primary"
        variant="solid"
        onClick={() => toast("操作成功", { description: "数据已保存" })}
      >
        默认通知
      </Button>
      <Button
        color="success"
        variant="solid"
        onClick={() => toast.success("成功", { description: "任务已完成" })}
      >
        成功通知
      </Button>
      <Button
        color="danger"
        variant="solid"
        onClick={() => toast.error("错误", { description: "操作失败，请重试" })}
      >
        错误通知
      </Button>
    </div>
  )
}
