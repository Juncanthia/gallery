import { MarchingWaves } from "@/components/effects/backgrounds/marching-waves"

export default function Demo() {
  return (
    <div className="relative w-full h-[400px] rounded overflow-hidden bg-[#05050f]">
      <MarchingWaves />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/70 text-lg font-medium drop-shadow-lg">
          Marching Waves
        </p>
      </div>
    </div>
  )
}
