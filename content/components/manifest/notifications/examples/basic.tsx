import { notification } from "@/components/ui/manifest-notifications"
import { Button } from "@/components/ui/button"

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          notification.success({
            title: "操作成功",
            description: "数据已保存",
          })
        }
      >
        成功通知
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          notification.info({
            title: "提示",
            description: "这是一条信息",
          })
        }
      >
        信息通知
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          notification.warning({
            title: "警告",
            description: "请注意检查",
          })
        }
      >
        警告通知
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() =>
          notification.error({
            title: "错误",
            description: "操作失败，请重试",
          })
        }
      >
        错误通知
      </Button>
    </div>
  )
}
