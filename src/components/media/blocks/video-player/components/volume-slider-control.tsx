import { cn } from "@/_internals/domains/media/utils/utils"
import * as VolumeSlider from "@/components/media/ui/volume-control"

export function VolumeSliderControl() {
  return (
    <VolumeSlider.Root
      className={cn(
        `
          focus-area relative h-1 grow cursor-crosshair rounded-md opacity-0 transition-opacity duration-300 ease-in-out -focus-area-x-2
          -focus-area-y-12
          group-focus-within:opacity-100
          group-hover:opacity-100
        `
      )}
      orientation="horizontal"
    >
      <VolumeSlider.Track>
        <VolumeSlider.Progress />
      </VolumeSlider.Track>
      <VolumeSlider.Thumb />
    </VolumeSlider.Root>
  )
}
