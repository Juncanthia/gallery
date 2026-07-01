import { ScatterChart } from "@/components/ui/scatter-chart"
import { Scatter } from "@/components/charts/bklit/charts"

const data = [
  { x: 10, y: 20 },
  { x: 30, y: 50 },
  { x: 50, y: 30 },
  { x: 70, y: 80 },
  { x: 90, y: 45 },
]

export default function Demo() {
  return (
    <ScatterChart data={data} xDataKey="x">
      <Scatter dataKey="y" fill="var(--chart-1)" />
    </ScatterChart>
  )
}
