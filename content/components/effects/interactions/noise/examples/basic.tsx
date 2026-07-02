import { Noise } from "@/components/effects/interactions/noise"

export default function NoiseBasicExample() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded bg-black">
      <Noise patternAlpha={15} />
    </div>
  )
}
