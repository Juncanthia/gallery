import { StatsDisplay } from "@/components/ui/stats-display"

export default function Demo() {
  return (
    <StatsDisplay
      id="stats-demo"
      title="Dashboard Overview"
      description="Key performance metrics for the current period"
      stats={[
        {
          key: "revenue",
          label: "Revenue",
          value: 128460,
          format: { kind: "currency", currency: "USD", decimals: 0 },
          diff: { value: 12.5, decimals: 1, label: "vs last month" },
          sparkline: {
            data: [120, 135, 128, 142, 138, 150, 145],
            color: "#10b981",
          },
        },
        {
          key: "users",
          label: "Active Users",
          value: 8472,
          format: { kind: "number", compact: true, decimals: 1 },
          diff: { value: -3.2, decimals: 1, label: "vs last week" },
          sparkline: {
            data: [8200, 8400, 8350, 8500, 8480, 8472],
            color: "#f59e0b",
          },
        },
        {
          key: "conversion",
          label: "Conversion Rate",
          value: 0.032,
          format: { kind: "percent", decimals: 1, basis: "fraction" },
          diff: { value: 0.5, decimals: 1, label: "vs last month" },
        },
        {
          key: "orders",
          label: "Total Orders",
          value: 1258,
          format: { kind: "number", decimals: 0 },
          diff: { value: 8.3, decimals: 1, label: "vs last month" },
        },
      ]}
    />
  )
}
