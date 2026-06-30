import { Gauge } from "@/components/ui/chamaac-gauge"

export default function Demo() {
  return (
    <div className="flex items-center justify-center py-8">
      <Gauge
        value={70}
        min={0}
        max={100}
        size={400}
        gap={4}
        thickness={10}
        activeColor="bg-blue-600"
        inactiveColor="bg-blue-100"
        label="Performance"
      />
    </div>
  )
}
