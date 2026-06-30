import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart } from "recharts"

const data = [
  { month: "1月", value: 186 },
  { month: "2月", value: 305 },
  { month: "3月", value: 237 },
  { month: "4月", value: 73 },
]

export default function ChartBasicExample() {
  return (
    <ChartContainer config={{ value: { label: "销售额" } }} className="h-48 w-full max-w-sm">
      <BarChart data={data}>
        <Bar dataKey="value" fill="var(--color-value, #3b82f6)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
