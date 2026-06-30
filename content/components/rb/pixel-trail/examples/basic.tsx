import { PixelTrail } from "@/components/ui/rb-pixel-trail"

export default function PixelTrailBasicExample() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded bg-black">
      <PixelTrail
        gridSize={30}
        trailSize={0.1}
        maxAge={250}
        color="#ffffff"
      />
    </div>
  )
}
