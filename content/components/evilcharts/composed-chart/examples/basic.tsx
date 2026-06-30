"use client";

import { EvilComposedChart } from "@/components/ui/evilcharts-composed-chart";
import {
  Bar,
  Line,
  XAxis,
  Grid,
  Tooltip,
  Legend,
  ActiveDot,
  Dot,
} from "@/components/evilcharts/components/composed-chart";
import { type ChartConfig } from "@/components/evilcharts/components/chart";

const data = [
  { month: "1月", revenue: 4200, profit: 1800 },
  { month: "2月", revenue: 5800, profit: 2400 },
  { month: "3月", revenue: 4100, profit: 1600 },
  { month: "4月", revenue: 6200, profit: 2800 },
  { month: "5月", revenue: 5400, profit: 2200 },
  { month: "6月", revenue: 7800, profit: 3400 },
  { month: "7月", revenue: 6100, profit: 2600 },
  { month: "8月", revenue: 8200, profit: 3800 },
  { month: "9月", revenue: 5900, profit: 2500 },
  { month: "10月", revenue: 6800, profit: 3000 },
  { month: "11月", revenue: 7200, profit: 3200 },
  { month: "12月", revenue: 9100, profit: 4200 },
];

const chartConfig = {
  revenue: {
    label: "营收",
    colors: {
      light: ["#3b82f6"],
      dark: ["#6A5ACD"],
    },
  },
  profit: {
    label: "利润",
    colors: {
      light: ["#10b981"],
      dark: ["#34d399"],
    },
  },
} satisfies ChartConfig;

export default function Demo() {
  return (
    <EvilComposedChart
      className="h-full w-full p-4"
      xDataKey="month"
      data={data}
      config={chartConfig}
      showBrush
      brushFormatLabel={(value) => String(value).substring(0, 3)}
    >
      <Grid />
      <XAxis dataKey="month" tickFormatter={(value) => String(value).substring(0, 3)} />
      <Legend isClickable />
      <Tooltip />
      <Bar dataKey="revenue" isClickable />
      <Line dataKey="profit" isClickable>
        <ActiveDot variant="colored-border" />
        <Dot variant="default" />
      </Line>
    </EvilComposedChart>
  );
}
