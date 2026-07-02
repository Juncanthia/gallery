import { Gauge } from "@/components/charts/chart-kit"

export default function Demo() {
  return (
    <div className="min-w-[300px]">
      <Gauge
        value={65}
        centerValue={65}
        defaultLabel="完成率"
        suffix="%"
      />
    </div>
  )
}
