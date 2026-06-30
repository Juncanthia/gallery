"use client"

import {
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/limeplay/blocks/video-player/components/button"
import { useVolumeStore } from "@/components/limeplay/hooks/use-volume"
import { MuteControl } from "@/components/limeplay/ui/mute-control"

export function VolumeStateControl() {
  const muted = useVolumeStore((state) => state.muted)
  const volume = useVolumeStore((state) => state.level)

  return (
    <MuteControl asChild>
      <Button className="cursor-pointer" size="icon" variant="glass">
        {muted || volume === 0 ? (
          <SpeakerXIcon weight="fill" />
        ) : volume < 0.5 ? (
          <SpeakerLowIcon weight="fill" />
        ) : (
          <SpeakerHighIcon weight="fill" />
        )}
      </Button>
    </MuteControl>
  )
}
