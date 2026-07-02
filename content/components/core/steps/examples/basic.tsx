import { useState } from "react"
import { Steps } from "@/components/core/steps"
import { Button } from "@/components/core/button"

export default function StepsBasicExample() {
  const [current, setCurrent] = useState(1)

  const items = [
    { title: "第一步", description: "填写基本信息" },
    { title: "第二步", description: "验证身份" },
    { title: "第三步", description: "完成注册" },
  ]

  return (
    <div className="w-full space-y-4">
      <Steps current={current} items={items} />
      <div className="flex gap-2">
        <Button size="small" disabled={current <= 0} onClick={() => setCurrent(current - 1)}>
          上一步
        </Button>
        <Button size="small" color="primary" variant="solid" disabled={current >= 2} onClick={() => setCurrent(current + 1)}>
          下一步
        </Button>
      </div>
    </div>
  )
}
