import { Crosshair } from "@/components/effects/interactions/crosshair"

export default function CrosshairBasicExample() {
  return (
    <div className="relative h-[400px] w-full rounded-lg bg-neutral-900">
      <Crosshair color="white" />
      <div className="flex h-full items-center justify-center text-neutral-400">
        Hover over links to see effect
      </div>
    </div>
  )
}
