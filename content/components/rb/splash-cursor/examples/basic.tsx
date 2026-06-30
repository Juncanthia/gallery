import { SplashCursor } from "@/components/ui/rb-splash-cursor"

export default function SplashCursorBasicExample() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded bg-gray-900">
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={720}
        DENSITY_DISSIPATION={2}
        RAINBOW_MODE={true}
      />
    </div>
  )
}
