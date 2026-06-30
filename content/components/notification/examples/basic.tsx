import { notification } from "@/components/ui/notification-api"
import { Button } from "@/components/ui/button"
export default function Ntf() {
  return <div className="flex gap-2"><Button size="small" variant="outlined" onClick={() => notification.success({ message: "成功", description: "操作完成" })}>成功通知</Button></div>
}
