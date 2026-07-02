import { Toaster } from "sonner"
import { Button } from "@/components/core/button"
import { customToast } from "@/components/_internal/gooseui/lib/toast"
import { CustomToast } from "@/components/feedback/custom-toast"

export default function CustomToastBasicExample() {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button
          color="success"
          variant="solid"
          onClick={() =>
            customToast.success("操作成功", { description: "数据已保存到服务器。" })
          }
        >
          成功提示
        </Button>
        <Button
          color="danger"
          variant="solid"
          onClick={() =>
            customToast.error("操作失败", { description: "网络请求超时，请重试。" })
          }
        >
          错误提示
        </Button>
        <Button
          color="warning"
          variant="solid"
          onClick={() =>
            customToast.warning("请注意", {
              description: "当前操作可能覆盖已有数据。",
            })
          }
        >
          警告提示
        </Button>
        <Button
          color="info"
          variant="solid"
          onClick={() =>
            customToast.info("提示信息", {
              description: "新版本 v2.3.0 已发布，建议升级。",
            })
          }
        >
          信息提示
        </Button>
      </div>
    </>
  )
}
