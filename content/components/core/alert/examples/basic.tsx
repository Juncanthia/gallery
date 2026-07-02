import { Alert, AlertDescription, AlertTitle } from "@/components/core/alert"
import { Info } from "lucide-react"

export default function AlertBasicExample() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Alert>
        <Info className="size-4" />
        <AlertTitle>提示</AlertTitle>
        <AlertDescription>这是一条普通提示信息。</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <Info className="size-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>操作失败，请重试。</AlertDescription>
      </Alert>
      <Alert variant="success">
        <Info className="size-4" />
        <AlertTitle>成功</AlertTitle>
        <AlertDescription>操作已成功完成。</AlertDescription>
      </Alert>
    </div>
  )
}
