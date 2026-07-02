import { Edit, Heart } from "lucide-react"
import { FloatButton } from "@/components/core/float-button"

export default function FloatButtonBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FloatButton icon={<Edit className="size-5" />} tooltip="编辑" />
      <FloatButton type="primary" icon={<Heart className="size-5" />} tooltip="收藏" />
      <FloatButton icon={<Edit className="size-5" />} content="编辑" tooltip={{ title: "编辑当前项", placement: "left" }} />
      <FloatButton type="primary" icon={<Heart className="size-5" />} content="支持" />
    </div>
  )
}
