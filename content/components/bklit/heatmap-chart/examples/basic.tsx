import { HeatmapCells, HeatmapLegend, HeatmapTooltip, HeatmapXAxis, HeatmapYAxis } from "@/components/charts/bklit/charts"
import { HeatmapChart } from "@/components/ui/heatmap-chart"

function d(y: number, m: number, day: number) {
  return new Date(y, m - 1, day)
}

const data = [
  {
    bin: 0,
    bins: [
      { count: 0, bin: 0, date: d(2024, 6, 2) },
      { count: 2, bin: 1, date: d(2024, 6, 3) },
      { count: 0, bin: 2, date: d(2024, 6, 4) },
      { count: 4, bin: 3, date: d(2024, 6, 5) },
      { count: 3, bin: 4, date: d(2024, 6, 6) },
      { count: 1, bin: 5, date: d(2024, 6, 7) },
      { count: 0, bin: 6, date: d(2024, 6, 8) },
    ],
  },
  {
    bin: 1,
    bins: [
      { count: 0, bin: 0, date: d(2024, 6, 9) },
      { count: 1, bin: 1, date: d(2024, 6, 10) },
      { count: 2, bin: 2, date: d(2024, 6, 11) },
      { count: 3, bin: 3, date: d(2024, 6, 12) },
      { count: 0, bin: 4, date: d(2024, 6, 13) },
      { count: 2, bin: 5, date: d(2024, 6, 14) },
      { count: 0, bin: 6, date: d(2024, 6, 15) },
    ],
  },
  {
    bin: 2,
    bins: [
      { count: 1, bin: 0, date: d(2024, 6, 16) },
      { count: 4, bin: 1, date: d(2024, 6, 17) },
      { count: 2, bin: 2, date: d(2024, 6, 18) },
      { count: 0, bin: 3, date: d(2024, 6, 19) },
      { count: 3, bin: 4, date: d(2024, 6, 20) },
      { count: 0, bin: 5, date: d(2024, 6, 21) },
      { count: 1, bin: 6, date: d(2024, 6, 22) },
    ],
  },
  {
    bin: 3,
    bins: [
      { count: 0, bin: 0, date: d(2024, 6, 23) },
      { count: 2, bin: 1, date: d(2024, 6, 24) },
      { count: 3, bin: 2, date: d(2024, 6, 25) },
      { count: 4, bin: 3, date: d(2024, 6, 26) },
      { count: 0, bin: 4, date: d(2024, 6, 27) },
      { count: 1, bin: 5, date: d(2024, 6, 28) },
      { count: 0, bin: 6, date: d(2024, 6, 29) },
    ],
  },
  {
    bin: 4,
    bins: [
      { count: 0, bin: 0, date: d(2024, 6, 30) },
      { count: 3, bin: 1, date: d(2024, 7, 1) },
      { count: 1, bin: 2, date: d(2024, 7, 2) },
      { count: 0, bin: 3, date: d(2024, 7, 3) },
      { count: 2, bin: 4, date: d(2024, 7, 4) },
      { count: 4, bin: 5, date: d(2024, 7, 5) },
      { count: 0, bin: 6, date: d(2024, 7, 6) },
    ],
  },
  {
    bin: 5,
    bins: [
      { count: 1, bin: 0, date: d(2024, 7, 7) },
      { count: 2, bin: 1, date: d(2024, 7, 8) },
      { count: 0, bin: 2, date: d(2024, 7, 9) },
      { count: 3, bin: 3, date: d(2024, 7, 10) },
      { count: 4, bin: 4, date: d(2024, 7, 11) },
      { count: 1, bin: 5, date: d(2024, 7, 12) },
      { count: 0, bin: 6, date: d(2024, 7, 13) },
    ],
  },
]

export default function Demo() {
  return (
    <HeatmapChart data={data}>
      <HeatmapCells />
      <HeatmapXAxis />
      <HeatmapYAxis />
      <HeatmapLegend />
      <HeatmapTooltip />
    </HeatmapChart>
  )
}
