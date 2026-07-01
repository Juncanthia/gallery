import { LiveLineChart } from "@/components/ui/live-line-chart"
import { LiveLine, LiveXAxis, LiveYAxis } from "@/components/charts/bklit/charts"

const data = Array.from({ length: 50 }, (_, i) => ({
  time: (Date.now() - (50 - i) * 1000) / 1000,
  value: 100 + Math.sin(i * 0.3) * 30 + Math.random() * 10,
}))

export default function Demo() {
  return (
    <LiveLineChart data={data} value={data[data.length - 1]?.value ?? 100}>
      <LiveLine dataKey="value" stroke="var(--chart-line-primary)" />
      <LiveXAxis />
      <LiveYAxis />
    </LiveLineChart>
  )
}
