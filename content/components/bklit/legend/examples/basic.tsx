import { Legend, LegendItem, LegendMarker, LegendLabel, LegendValue, LegendProgress } from "@/components/ui/bklit-legend"

const items = [
  { label: "产品 A", value: 450, maxValue: 600, color: "var(--chart-1)" },
  { label: "产品 B", value: 320, maxValue: 600, color: "var(--chart-2)" },
  { label: "产品 C", value: 280, maxValue: 600, color: "var(--chart-3)" },
]

export default function Demo() {
  return (
    <Legend items={items}>
      <LegendItem>
        <div className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel />
          <LegendValue />
        </div>
        <LegendProgress />
      </LegendItem>
    </Legend>
  )
}
