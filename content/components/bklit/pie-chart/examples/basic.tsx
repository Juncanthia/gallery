import { PieChart } from "@/components/ui/pie-chart-bklit"
import { PieSlice } from "@/components/charts/bklit/charts"

const data = [
  { label: "A", value: 40, color: "var(--chart-line-primary)" },
  { label: "B", value: 30, color: "var(--chart-line-secondary)" },
  { label: "C", value: 20, color: "#22c55e" },
  { label: "D", value: 10, color: "#eab308" },
]

export default function Demo() {
  return (
    <PieChart data={data}>
      {data.map((item, i) => (
        <PieSlice key={item.label} index={i} />
      ))}
    </PieChart>
  )
}
