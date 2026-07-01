import { ComposedChart } from "@/components/charts/bklit/charts"
import { Line, Area, SeriesBar } from "@/components/charts/bklit/charts"

const data = [
  { date: new Date(2024, 0, 1), line: 100, area: 80, bar: 200 },
  { date: new Date(2024, 0, 2), line: 150, area: 120, bar: 250 },
  { date: new Date(2024, 0, 3), line: 130, area: 100, bar: 180 },
  { date: new Date(2024, 0, 4), line: 200, area: 170, bar: 300 },
  { date: new Date(2024, 0, 5), line: 180, area: 160, bar: 220 },
]

export default function Demo() {
  return (
    <ComposedChart data={data}>
      <Area dataKey="area" fill="var(--chart-line-secondary)" fillOpacity={0.2} stroke="var(--chart-line-secondary)" />
      <SeriesBar dataKey="bar" fill="var(--chart-line-primary)" fillOpacity={0.3} />
      <Line dataKey="line" stroke="var(--chart-line-primary)" />
    </ComposedChart>
  )
}
