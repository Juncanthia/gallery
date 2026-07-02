import { BarChart } from "@/components/charts/chart-kit"
import { Bar } from "@/components/charts/chart-kit"

const data = [
  { name: "一月", value: 400 },
  { name: "二月", value: 300 },
  { name: "三月", value: 600 },
  { name: "四月", value: 200 },
  { name: "五月", value: 500 },
]

export default function Demo() {
  return (
    <BarChart data={data} xDataKey="name">
      <Bar dataKey="value" fill="var(--chart-line-primary)" />
    </BarChart>
  )
}
