import { showLegacyNotification } from "@/components/legacy-ui"
import { Button } from "@/components/core/button"

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          showLegacyNotification({
            title: "操作成功",
            body: "数据已保存",
          })
        }
      >
        成功通知
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          showLegacyNotification({
            title: "提示",
            body: "这是一条信息",
          })
        }
      >
        信息通知
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          showLegacyNotification({
            title: "警告",
            body: "请注意检查",
          })
        }
      >
        警告通知
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          showLegacyNotification({
            title: "错误",
            body: "操作失败，请重试",
          })
        }
      >
        错误通知
      </Button>
    </div>
  )
}
