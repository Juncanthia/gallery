import { RadarChart } from "@/components/charts/chart-kit"
import { RadarArea, RadarGrid, RadarAxis, RadarLabels } from "@/components/charts/chart-kit"

const metrics = [
  { key: "speed", label: "速度" },
  { key: "strength", label: "力量" },
  { key: "endurance", label: "耐力" },
  { key: "agility", label: "敏捷" },
  { key: "intelligence", label: "智力" },
]

const data = [
  {
    label: "当前能力",
    values: { speed: 80, strength: 65, endurance: 90, agility: 70, intelligence: 55 },
  },
]

export default function Demo() {
  return (
    <RadarChart data={data} metrics={metrics}>
      <RadarGrid />
      <RadarAxis />
      <RadarArea index={0} />
      <RadarLabels />
    </RadarChart>
  )
}
