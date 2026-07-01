import { Bell } from "lucide-react"
import { LegacyNotification } from "@/components/ui/notification"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8">
      <LegacyNotification
        title="提醒"
        subtitle="新消息"
        body="您有一条新的系统通知"
        time="刚刚"
      />
      <LegacyNotification
        body="这是一条纯文本通知，不显示图标和副标题"
        showIcon={false}
        showSubtitle={false}
        time="2 分钟前"
        title="系统消息"
      />
      <LegacyNotification
        body="任务已完成，点击查看详情"
        icon={<Bell />}
        subtitle="任务中心"
        time="5 分钟前"
        title="操作成功"
      />
    </div>
  )
}
