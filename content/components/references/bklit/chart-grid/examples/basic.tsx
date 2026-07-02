import { BarChart } from "@/components/charts/chart-kit"
import { Bar } from "@/components/charts/chart-kit"
import { Grid } from "@/components/charts/bklit/charts"

const data = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 600 },
  { name: "D", value: 200 },
]

export default function Demo() {
  return (
    <BarChart data={data} xDataKey="name">
      <Grid horizontal stroke="var(--chart-grid)" />
      <Bar dataKey="value" fill="var(--chart-line-primary)" />
    </BarChart>
  )
}
