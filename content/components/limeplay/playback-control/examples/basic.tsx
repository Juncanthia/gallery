import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { PlaybackControl } from "@/components/ui/limeplay-playback-control"
import { usePlaybackStore } from "@/components/limeplay/hooks/use-playback"

export default function PlaybackControlBasicExample() {
  const status = usePlaybackStore((state) => state.status)

  return (
    <PlaybackControl asChild shortcut="Space">
      <Button size="icon" variant="ghost">
        {status === "playing" ? (
          <PauseIcon weight="fill" />
        ) : status === "ended" ? (
          <RepeatIcon />
        ) : status === "buffering" ? (
          <CircleNotchIcon className="animate-spin" weight="bold" />
        ) : (
          <PlayIcon weight="fill" />
        )}
      </Button>
    </PlaybackControl>
  )
}
