import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/core/hover-card"
export default function Hc() {
  return (
    <HoverCard>
      <HoverCardTrigger className="text-sm underline cursor-pointer">悬停查看详情</HoverCardTrigger>
      <HoverCardContent className="w-60"><div className="text-sm">悬停卡片内容，展示额外信息。</div></HoverCardContent>
    </HoverCard>
  )
}
