import { GridBloom } from "@/components/ui/chamaac-grid-bloom"

export default function Demo() {
  return (
    <div className="relative w-full h-64 rounded overflow-hidden bg-[#0a0a0a]">
      <GridBloom />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-fuchsia-300/80 text-lg font-medium drop-shadow-lg">GridBloom</p>
      </div>
    </div>
  )
}
