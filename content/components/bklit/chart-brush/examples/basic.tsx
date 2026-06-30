import { LineChart, Line } from "@/components/bklit/charts"
import { ChartBrush } from "@/components/ui/bklit-chart-brush"

const data = Array.from({ length: 100 }, (_, i) => ({
  date: new Date(2024, 0, i + 1),
  value: 100 + Math.sin(i * 0.2) * 50 + Math.random() * 20,
}))

export default function Demo() {
  return (
    <LineChart data={data}>
      <ChartBrush />
      <Line dataKey="value" stroke="var(--chart-line-primary)" />
    </LineChart>
  )
}
