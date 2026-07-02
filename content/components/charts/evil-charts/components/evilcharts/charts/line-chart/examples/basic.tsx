"use client"

import { EvilLineChart } from "@/components/charts/evil-charts"
import {
  Line,
  XAxis,
  Tooltip,
  Legend,
  Dot,
  ActiveDot,
} from "@/components/charts/evil-charts/components/line-chart"
import { type ChartConfig } from "@/components/charts/evil-charts/components/chart"

const data = [
  { month: "1月", desktop: 342, mobile: 184 },
  { month: "2月", desktop: 876, mobile: 491 },
  { month: "3月", desktop: 512, mobile: 290 },
  { month: "4月", desktop: 629, mobile: 391 },
  { month: "5月", desktop: 458, mobile: 309 },
  { month: "6月", desktop: 781, mobile: 449 },
  { month: "7月", desktop: 394, mobile: 234 },
  { month: "8月", desktop: 925, mobile: 557 },
  { month: "9月", desktop: 647, mobile: 367 },
  { month: "10月", desktop: 532, mobile: 357 },
  { month: "11月", desktop: 803, mobile: 515 },
  { month: "12月", desktop: 271, mobile: 149 },
]

const chartConfig = {
  desktop: {
    label: "桌面端",
    colors: {
      light: ["#047857"],
      dark: ["#10b981"],
    },
  },
  mobile: {
    label: "移动端",
    colors: {
      light: ["#be123c"],
      dark: ["#f43f5e"],
    },
  },
} satisfies ChartConfig

export default function Demo() {
  return (
    <EvilLineChart
      data={data}
      config={chartConfig}
      className="h-full w-full p-4"
      xDataKey="month"
    >
      <XAxis dataKey="month" />
      <Legend isClickable />
      <Tooltip />
      <Line dataKey="desktop" strokeVariant="solid" isClickable>
        <Dot variant="border" />
        <ActiveDot variant="colored-border" />
      </Line>
      <Line dataKey="mobile" strokeVariant="solid" isClickable>
        <Dot variant="border" />
        <ActiveDot variant="colored-border" />
      </Line>
    </EvilLineChart>
  )
}
