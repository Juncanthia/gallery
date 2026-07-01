"use client"

import {
  CircleNotchIcon,
  PauseIcon,
  PlayIcon,
  RepeatIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/media/blocks/video-player/components/button"
import { usePlaybackStore } from "@/components/media/hooks/use-playback"
import { PlaybackControl } from "@/components/media/ui/playback-control"

export function PlaybackStateControl() {
  const status = usePlaybackStore((state) => state.status)

  return (
    <PlaybackControl asChild>
      <Button className="cursor-pointer" size="icon" variant="glass">
        {status === "playing" ? (
          <PauseIcon weight="fill" />
        ) : status === "ended" ? (
          <RepeatIcon />
        ) : status === "buffering" || status === "loading" ? (
          <CircleNotchIcon className="animate-spin" weight="bold" />
        ) : (
          <PlayIcon weight="fill" />
        )}
      </Button>
    </PlaybackControl>
  )
}
