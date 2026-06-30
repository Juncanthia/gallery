import {
  Pill,
  PillAvatar,
  PillStatus,
  PillIndicator,
  PillDelta,
} from "@/components/ui/pill"
import { BellIcon } from "lucide-react"

export default function PillBasicExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Pill color="primary" variant="solid">
        已发布
      </Pill>
      <Pill color="destructive" variant="soft">
        已删除
      </Pill>
      <Pill>
        <PillIndicator variant="success" pulse />
        在线
      </Pill>
      <Pill>
        <PillAvatar
          src="https://github.com/shadcn.png"
          fallback="CN"
        />
        <PillStatus>
          <PillIndicator variant="success" />
          shadcn
        </PillStatus>
        维护者
      </Pill>
      <Pill>
        <BellIcon className="size-3" />
        3 条新通知
      </Pill>
      <Pill>
        本周营收
        <PillDelta delta={12} />
        12%
      </Pill>
    </div>
  )
}
