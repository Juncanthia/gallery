import { showLegacyNotification } from "@/components/_internal/sabraman"
import { Button } from "@/components/core/button"

export default function Na() {
  return (
    <Button
      size="small"
      variant="outlined"
      onClick={() =>
        showLegacyNotification({
          title: "通知标题",
          body: "通知描述内容",
        })
      }
    >
      发送通知
    </Button>
  )
}
