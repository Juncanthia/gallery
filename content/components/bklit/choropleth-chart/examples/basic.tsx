import { ChoroplethFeatureComponent, ChoroplethGraticule, ChoroplethTooltip } from "@/components/charts/bklit/charts"
import { ChoroplethChart } from "@/components/ui/choropleth-chart"
import type { FeatureCollection, Geometry } from "geojson"

// 简化的大陆区域 GeoJSON 演示数据
// 实际使用时替换为 Natural Earth 或 GADM 等真实地理数据
const demoGeoData: FeatureCollection<Geometry, { name: string; value: number }> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "亚洲", value: 4500 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [60, 5],
            [150, 5],
            [150, 55],
            [60, 55],
            [60, 5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "欧洲", value: 3200 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-10, 35],
            [40, 35],
            [40, 70],
            [-10, 70],
            [-10, 35],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "北美洲", value: 2800 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-130, 15],
            [-60, 15],
            [-60, 75],
            [-130, 75],
            [-130, 15],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "南美洲", value: 1200 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-80, -55],
            [-35, -55],
            [-35, 12],
            [-80, 12],
            [-80, -55],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "非洲", value: 1800 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-20, -35],
            [50, -35],
            [50, 35],
            [-20, 35],
            [-20, -35],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "大洋洲", value: 600 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [110, -45],
            [180, -45],
            [180, -5],
            [110, -5],
            [110, -45],
          ],
        ],
      },
    },
  ],
}

export default function Demo() {
  return (
    <ChoroplethChart
      aspectRatio="16 / 9"
      center={[15, 15]}
      data={demoGeoData}
      zoomEnabled
      zoomMax={4}
      zoomMin={0.5}
    >
      <ChoroplethFeatureComponent
        getFeatureColor={(f) => {
          const v = (f.properties?.value as number) ?? 0
          if (v > 3000) return "var(--chart-1)"
          if (v > 1500) return "var(--chart-2)"
          return "var(--chart-3)"
        }}
        stroke="var(--background)"
      />
      <ChoroplethGraticule />
      <ChoroplethTooltip
        formatValue={(v) => `${v} 百万`}
        getFeatureValue={(f) => f.properties?.value as number | undefined}
        valueLabel="GDP"
      />
    </ChoroplethChart>
  )
}
