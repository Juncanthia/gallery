"use client";

import { ChartContainer } from "@/components/charts/evilcharts";
import type { ChartConfig } from "@/components/charts/evilcharts/components/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { month: "1月", desktop: 186, mobile: 80 },
  { month: "2月", desktop: 305, mobile: 200 },
  { month: "3月", desktop: 237, mobile: 120 },
  { month: "4月", desktop: 273, mobile: 190 },
  { month: "5月", desktop: 209, mobile: 130 },
  { month: "6月", desktop: 346, mobile: 250 },
  { month: "7月", desktop: 181, mobile: 110 },
  { month: "8月", desktop: 392, mobile: 280 },
  { month: "9月", desktop: 298, mobile: 210 },
  { month: "10月", desktop: 215, mobile: 150 },
  { month: "11月", desktop: 327, mobile: 230 },
  { month: "12月", desktop: 162, mobile: 100 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    colors: {
      light: ["#2563eb"],
      dark: ["#60a5fa"],
    },
  },
  mobile: {
    label: "Mobile",
    colors: {
      light: ["#059669"],
      dark: ["#34d399"],
    },
  },
} satisfies ChartConfig;

export default function Demo() {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full p-4">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area
          dataKey="desktop"
          type="monotone"
          fill="var(--color-desktop-0)"
          stroke="var(--color-desktop-0)"
          fillOpacity={0.2}
        />
        <Area
          dataKey="mobile"
          type="monotone"
          fill="var(--color-mobile-0)"
          stroke="var(--color-mobile-0)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
