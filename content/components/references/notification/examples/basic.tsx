import { showLegacyNotification } from "@/components/legacy-ui"
import { Button } from "@/components/core/button"

export default function Ntf() {
  return (
    <div className="flex gap-2">
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          showLegacyNotification({
            title: "成功",
            body: "操作完成",
          })
        }
      >
        成功通知
      </Button>
    </div>
  )
}
