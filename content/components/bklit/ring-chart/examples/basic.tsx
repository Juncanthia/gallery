import { RingChart } from "@/components/ui/bklit-ring-chart"
import { Ring } from "@/components/bklit/charts"

const data = [
  { label: "Q1", value: 85, maxValue: 100, color: "var(--chart-1)" },
  { label: "Q2", value: 65, maxValue: 100, color: "var(--chart-2)" },
  { label: "Q3", value: 45, maxValue: 100, color: "var(--chart-3)" },
]

export default function Demo() {
  return (
    <RingChart data={data} baseInnerRadius={50} strokeWidth={14}>
      <Ring index={0} />
      <Ring index={1} />
      <Ring index={2} />
    </RingChart>
  )
}
