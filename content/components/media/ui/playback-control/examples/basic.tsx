import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/core/button"
import { PlaybackControl } from "@/components/media/ui/playback-control"
import { usePlaybackStore } from "@/components/media/hooks/use-playback"

export default function PlaybackControlBasicExample() {
  const blocks/status = usePlaybackStore((state) => state.blocks/status)

  return (
    <PlaybackControl asChild shortcut="Space">
      <Button size="icon" variant="ghost">
        {blocks/status === "playing" ? (
          <PauseIcon weight="fill" />
        ) : blocks/status === "ended" ? (
          <RepeatIcon />
        ) : blocks/status === "buffering" ? (
          <CircleNotchIcon className="animate-spin" weight="bold" />
        ) : (
          <PlayIcon weight="fill" />
        )}
      </Button>
    </PlaybackControl>
  )
}
