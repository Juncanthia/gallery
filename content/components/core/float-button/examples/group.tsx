import { Edit, Heart, MessageCircle, Share2 } from "lucide-react"
import { FloatButtonGroup } from "@/components/core/float-button"

export default function FloatButtonGroupExample() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <FloatButtonGroup
        placement="top"
        type="primary"
        items={[
          { icon: <Edit className="size-5" />, tooltip: "编辑" },
          { icon: <Heart className="size-5" />, tooltip: "收藏" },
          { icon: <MessageCircle className="size-5" />, tooltip: "评论" },
        ]}
      />

      <FloatButtonGroup
        trigger="hover"
        placement="right"
        shape="square"
        items={[
          { icon: <Share2 className="size-5" />, tooltip: "分享" },
          { icon: <Heart className="size-5" />, tooltip: "收藏" },
        ]}
      />
    </div>
  )
}
