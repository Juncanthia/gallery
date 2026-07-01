import { LiquidMorph } from "@/components/effects/backgrounds/chamaac/liquid-morph/liquid-morph"

export default function Demo() {
  return (
    <div className="relative w-full h-64 rounded overflow-hidden">
      <LiquidMorph />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/70 text-lg font-medium drop-shadow-lg">
          Liquid Morph
        </p>
      </div>
    </div>
  )
}
