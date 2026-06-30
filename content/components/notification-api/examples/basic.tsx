import { notification } from "@/components/ui/notification-api"
import { Button } from "@/components/ui/button"
export default function Na() {
  return <Button size="small" variant="outlined" onClick={() => notification.info({ message: "通知标题", description: "通知描述内容" })}>发送通知</Button>
}
