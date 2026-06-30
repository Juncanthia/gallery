import { EvilAreaChart } from "@/components/ui/evilcharts-area-chart"
import {
  Area,
  XAxis,
  Grid,
  Tooltip,
  Legend,
  Dot,
  ActiveDot,
} from "@/components/evilcharts/components/area-chart"
import type { ChartConfig } from "@/components/evilcharts/components/chart"

const data = [
  { month: "1月", desktop: 342, mobile: 245 },
  { month: "2月", desktop: 876, mobile: 654 },
  { month: "3月", desktop: 512, mobile: 387 },
  { month: "4月", desktop: 629, mobile: 521 },
  { month: "5月", desktop: 458, mobile: 412 },
  { month: "6月", desktop: 781, mobile: 598 },
  { month: "7月", desktop: 394, mobile: 312 },
  { month: "8月", desktop: 925, mobile: 743 },
  { month: "9月", desktop: 647, mobile: 489 },
  { month: "10月", desktop: 532, mobile: 476 },
  { month: "11月", desktop: 803, mobile: 687 },
  { month: "12月", desktop: 271, mobile: 198 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    colors: {
      light: ["#047857"],
      dark: ["#10b981"],
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: ["#be123c"],
      dark: ["#f43f5e"],
    },
  },
} satisfies ChartConfig

export default function Demo() {
  return (
    <EvilAreaChart
      data={data}
      config={chartConfig}
      className="h-full w-full p-4"
      stackType="stacked"
      showBrush
      xDataKey="month"
      brushFormatLabel={(value) => String(value).substring(0, 2)}
    >
      <Grid />
      <XAxis dataKey="month" tickFormatter={(value) => value} />
      <Legend isClickable />
      <Tooltip />
      <Area dataKey="desktop" variant="gradient" isClickable>
        <Dot variant="border" />
        <ActiveDot variant="colored-border" />
      </Area>
      <Area dataKey="mobile" variant="gradient" isClickable>
        <Dot variant="border" />
        <ActiveDot variant="colored-border" />
      </Area>
    </EvilAreaChart>
  )
}
