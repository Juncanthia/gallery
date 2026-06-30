import { Chart } from "@/components/ui/tool-chart"

const data = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export default function Demo() {
  return (
    <Chart
      id="chart-demo"
      type="bar"
      title="Monthly Revenue"
      description="January - June 2024"
      data={data}
      xKey="month"
      series={[
        { key: "desktop", label: "Desktop" },
        { key: "mobile", label: "Mobile" },
      ]}
      showLegend
    />
  )
}
