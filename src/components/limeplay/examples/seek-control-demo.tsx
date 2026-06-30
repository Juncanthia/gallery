import {
  CaretCircleDoubleLeftIcon,
  CaretCircleDoubleRightIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@hyper/limeplay/ui/button"
import { SeekControl } from "@hyper/limeplay/ui/seek-controls"

export function SeekControlDemo() {
  return (
    <div className="flex items-center gap-2">
      <SeekControl asChild offset={-10}>
        <Button size="icon" variant="ghost">
          <CaretCircleDoubleLeftIcon />
        </Button>
      </SeekControl>
      <SeekControl asChild offset={10}>
        <Button size="icon" variant="ghost">
          <CaretCircleDoubleRightIcon />
        </Button>
      </SeekControl>
    </div>
  )
}
