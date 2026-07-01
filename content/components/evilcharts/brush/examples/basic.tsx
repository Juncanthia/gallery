"use client"

import { EvilBrush } from "@/components/ui/brush"
import { useEvilBrush } from "@/components/charts/evilcharts/components/brush"
import { EvilAreaChart } from "@/components/charts/evilcharts"
import { Area, XAxis, Grid, Tooltip } from "@/components/charts/evilcharts/components/area-chart"
import { type ChartConfig } from "@/components/charts/evilcharts/components/chart"

const chartConfig = {
  sales: {
    label: "销售额",
    colors: {
      light: ["#2563eb"],
      dark: ["#3b82f6"],
    },
  },
  orders: {
    label: "订单数",
    colors: {
      light: ["#d946ef"],
      dark: ["#e879f9"],
    },
  },
} satisfies ChartConfig

// 90 days of deterministic sample data with wave patterns
const data = Array.from({ length: 90 }, (_, i) => ({
  day: `${i + 1}日`,
  sales: Math.round(300 + Math.sin(i / 7) * 150 + Math.sin(i / 20) * 80),
  orders: Math.round(80 + Math.cos(i / 9) * 40 + Math.cos(i / 25) * 20),
}))

export default function Demo() {
  const { visibleData, brushProps } = useEvilBrush({ data })

  return (
    <div className="flex flex-col gap-2 h-full w-full p-4">
      <EvilAreaChart
        data={visibleData}
        config={chartConfig}
        className="flex-1 w-full"
        xDataKey="day"
      >
        <Grid />
        <XAxis dataKey="day" />
        <Tooltip />
        <Area dataKey="sales" variant="default" />
        <Area dataKey="orders" variant="default" />
      </EvilAreaChart>

      <EvilBrush
        data={data}
        chartConfig={chartConfig}
        dataKeys={["sales", "orders"]}
        xDataKey="day"
        variant="area"
        height={56}
        {...brushProps}
      />
    </div>
  )
}
