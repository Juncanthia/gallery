import {
  CaretCircleDoubleLeftIcon,
  CaretCircleDoubleRightIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/core/button"
import { SeekControl } from "@/components/media/ui/seek-controls"

export function SeekControlDemo() {
  return (
    <div className="flex items-center gap-2">
      <SeekControl asChild offset={-10}>
        <Button shape="square" variant="text">
          <CaretCircleDoubleLeftIcon />
        </Button>
      </SeekControl>
      <SeekControl asChild offset={10}>
        <Button shape="square" variant="text">
          <CaretCircleDoubleRightIcon />
        </Button>
      </SeekControl>
    </div>
  )
}
