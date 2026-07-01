import { Waves } from "@/components/effects/backgrounds/chamaac/waves/waves"

export default function Demo() {
  return (
    <div className="relative w-full h-64 rounded overflow-hidden bg-black">
      <Waves />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/80 text-lg font-medium drop-shadow-lg">Waves</p>
      </div>
    </div>
  )
}
