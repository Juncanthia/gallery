import { Root } from "@/components/ui/limeplay-volume-control"
import {
  Track,
  Progress,
  Thumb,
} from "@/components/limeplay/ui/volume-control"

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center p-4">
      <Root className="relative flex h-5 w-full touch-none items-center select-none">
        <Track className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <Progress className="absolute h-full bg-primary" />
        </Track>
        <Thumb />
      </Root>
    </div>
  )
}
