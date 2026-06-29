import { Alert } from "@/components/base/alert"
import * as React from "react"

export default function SmartisanAlertExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平警告提示 (Standard Flat Alert)
        </h4>
        <div className="space-y-4 max-w-md">
          <Alert type="success" title="成功提示" description="您已成功完成了本次系统升级，所有的配置已自动同步。" showIcon />
          <Alert type="error" title="错误提示" description="系统检测到不兼容的依赖版本，请检查您的 package.json 文件。" showIcon />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化警告提示 (Smartisan Skeuomorphic Alert)
        </h4>
        <div className="space-y-4 max-w-md">
          <Alert variant="skeuomorphic" type="success" title="成功提示 (浮雕面板)" description="您已成功完成了本次系统升级，所有的配置已自动同步。" showIcon />
          <Alert variant="skeuomorphic" type="error" title="错误提示 (浮雕面板)" description="系统检测到不兼容的依赖版本，请检查您的 package.json 文件。" showIcon />
        </div>
      </div>
    </div>
  )
}
