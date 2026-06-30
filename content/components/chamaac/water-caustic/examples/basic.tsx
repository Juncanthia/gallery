import { WaterCaustic } from "@/components/ui/chamaac-water-caustic"

export default function Demo() {
  return (
    <div className="relative w-full h-64 rounded overflow-hidden bg-slate-950">
      <WaterCaustic color="#5ea8ff" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/70 text-lg font-medium drop-shadow-lg">Water Caustic</p>
      </div>
    </div>
  )
}
