import { AreaChart } from "@/components/charts/chart-kit"
import { Area, Grid } from "@/components/charts/chart-kit"

const data = [
  { date: new Date(2024, 0, 1), value: 100 },
  { date: new Date(2024, 0, 2), value: 220 },
  { date: new Date(2024, 0, 3), value: 150 },
  { date: new Date(2024, 0, 4), value: 380 },
  { date: new Date(2024, 0, 5), value: 260 },
  { date: new Date(2024, 0, 6), value: 310 },
  { date: new Date(2024, 0, 7), value: 420 },
  { date: new Date(2024, 0, 8), value: 350 },
  { date: new Date(2024, 0, 9), value: 480 },
  { date: new Date(2024, 0, 10), value: 400 },
]

export default function Demo() {
  return (
    <AreaChart data={data}>
      <Grid />
      <Area dataKey="value" fill="var(--chart-line-primary)" fillOpacity={0.3} stroke="var(--chart-line-primary)" />
    </AreaChart>
  )
}
