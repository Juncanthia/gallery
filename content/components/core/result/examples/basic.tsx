import { Result } from "@/components/core/result"
import { Button } from "@/components/core/button"
import { CheckCircle } from "lucide-react"

export default function ResultBasicExample() {
  return (
    <Result
      icon={<CheckCircle className="size-12 text-green-500" />}
      title="操作成功"
      description="您的操作已成功完成，预计 5 分钟后生效。"
    >
      <div className="flex gap-2">
        <Button color="primary" variant="solid">返回首页</Button>
        <Button variant="outlined">查看详情</Button>
      </div>
    </Result>
  )
}
