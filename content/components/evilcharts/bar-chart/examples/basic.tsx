"use client"

import { EvilBarChart } from "@/components/charts/evilcharts"
import { Bar, XAxis, Grid, Tooltip, Legend } from "@/components/charts/evilcharts/components/bar-chart"
import { type ChartConfig } from "@/components/charts/evilcharts/components/chart"

const data = [
  { month: "1月", revenue: 342, cost: 184 },
  { month: "2月", revenue: 876, cost: 491 },
  { month: "3月", revenue: 512, cost: 290 },
  { month: "4月", revenue: 629, cost: 391 },
  { month: "5月", revenue: 458, cost: 309 },
  { month: "6月", revenue: 781, cost: 449 },
  { month: "7月", revenue: 394, cost: 234 },
  { month: "8月", revenue: 925, cost: 557 },
  { month: "9月", revenue: 647, cost: 367 },
  { month: "10月", revenue: 532, cost: 357 },
  { month: "11月", revenue: 803, cost: 515 },
  { month: "12月", revenue: 271, cost: 149 },
]

const chartConfig = {
  revenue: {
    label: "营收",
    colors: {
      light: ["#047857"],
      dark: ["#10b981"],
    },
  },
  cost: {
    label: "成本",
    colors: {
      light: ["#be123c"],
      dark: ["#f43f5e"],
    },
  },
} satisfies ChartConfig

export default function Demo() {
  return (
    <EvilBarChart
      data={data}
      config={chartConfig}
      className="h-full w-full p-4"
      xDataKey="month"
    >
      <Grid />
      <XAxis dataKey="month" />
      <Tooltip />
      <Legend />
      <Bar dataKey="revenue" variant="default" />
      <Bar dataKey="cost" variant="default" />
    </EvilBarChart>
  )
}
