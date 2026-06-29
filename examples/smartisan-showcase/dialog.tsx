import { Dialog } from "@/components/base/dialog"
import { Button } from "@/components/base/button"
import * as React from "react"

export default function SmartisanDialogExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平对话框 (Standard Flat Dialog)
        </h4>
        <div className="flex flex-wrap gap-4 items-center">
          <Dialog
            trigger={<Button>打开标准对话框</Button>}
            title="系统提示"
            description="这是一个标准的扁平化对话框，采用常规的无边框圆角和平面色块。"
          >
            <div className="text-sm py-4">
              您确定要执行此操作吗？此操作将无法撤销。
            </div>
          </Dialog>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化对话框 (Smartisan Skeuomorphic Dialog)
        </h4>
        <div className="flex flex-wrap gap-4 items-center">
          <Dialog
            variant="skeuomorphic"
            trigger={<Button variant="skeuomorphic">打开拟物化对话框</Button>}
            title="系统安全箱提示"
            description="这是一个复刻 Smartisan OS 经典安全箱质感的拟物化对话框，带有精细的头部/尾部渐变和金属质感按钮。"
          >
            <div className="text-sm">
              您正在尝试修改核心系统配置。为了您的数据安全，请确认此操作。
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
