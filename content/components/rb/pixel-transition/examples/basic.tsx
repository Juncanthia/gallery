import { PixelTransition } from "@/components/ui/pixel-transition"

export default function PixelTransitionBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <PixelTransition
        firstContent={
          <div className="flex h-full w-full items-center justify-center text-white">
            <span>Hover me</span>
          </div>
        }
        secondContent={
          <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
            <span>Revealed!</span>
          </div>
        }
        gridSize={7}
        pixelColor="#ffffff"
      />
    </div>
  )
}
