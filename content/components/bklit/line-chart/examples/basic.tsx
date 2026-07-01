import { LineChart } from "@/components/ui/line-chart-bklit"
import { Line } from "@/components/charts/bklit/charts"

const data = [
  { date: new Date(2024, 0, 1), value: 100 },
  { date: new Date(2024, 0, 2), value: 200 },
  { date: new Date(2024, 0, 3), value: 150 },
  { date: new Date(2024, 0, 4), value: 300 },
  { date: new Date(2024, 0, 5), value: 250 },
]

export default function Demo() {
  return (
    <LineChart data={data}>
      <Line dataKey="value" stroke="var(--chart-line-primary)" />
    </LineChart>
  )
}
