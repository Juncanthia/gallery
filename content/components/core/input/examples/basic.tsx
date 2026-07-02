import { Input } from "@/components/core/input"

export default function InputBasicExample() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">基础</p>
        <Input placeholder="请输入内容" className="w-48" />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">前缀</p>
        <Input placeholder="搜索..." prefix={<span className="text-sm">🔍</span>} className="w-48" />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">后缀 + 清除</p>
        <Input placeholder="输入后清除" suffix={<span className="text-xs text-muted-foreground">.com</span>} allowClear className="w-48" />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">校验状态</p>
        <Input blocks/status="error" placeholder="错误状态" className="w-48" />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">禁用</p>
        <Input disabled defaultValue="禁用内容" className="w-48" />
      </div>
    </div>
  )
}
