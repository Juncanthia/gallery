import { Nebula } from "@/components/effects/backgrounds/chamaac/nebula/nebula"

export default function Demo() {
  return (
    <div className="relative w-full h-64 rounded overflow-hidden bg-[#1a0b2e]">
      <Nebula />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/80 text-lg font-medium drop-shadow-lg">Nebula</p>
      </div>
    </div>
  )
}
