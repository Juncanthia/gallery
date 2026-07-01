import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/blocks/tooltip-motion"
import { Button } from "@/components/ui/button"

export default function TooltipMotionBasicExample() {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center p-8">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outlined">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            This is a tooltip with motion animation. It smoothly scales in and
            out when hovering.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
