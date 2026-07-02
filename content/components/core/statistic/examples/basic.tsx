import { Statistic } from "@/components/core/statistic"

export default function StatisticBasicExample() {
  return (
    <div className="flex flex-wrap gap-8">
      <Statistic title="活跃用户" value={112893} />
      <Statistic title="账户余额" value={112893} prefix="$" precision={2} />
      <Statistic title="完成率" value={86.5} suffix="%" />
      <Statistic title="反馈" value={1128} prefix={<span className="text-green-500">↑</span>} />
    </div>
  )
}
