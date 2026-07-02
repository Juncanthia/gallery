import { ShoppingCart } from "lucide-react"
import { FloatButton } from "@/components/core/float-button"

export default function FloatButtonBadgeExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FloatButton
        type="primary"
        icon={<ShoppingCart className="size-5" />}
        badge={5}
        tooltip="购物车"
      />
      <FloatButton
        type="primary"
        icon={<ShoppingCart className="size-5" />}
        badge={{ count: 99, color: "red" }}
        tooltip="购物车"
      />
      <FloatButton
        icon={<ShoppingCart className="size-5" />}
        badge={{ dot: true, color: "green" }}
        tooltip="有新通知"
      />
    </div>
  )
}
