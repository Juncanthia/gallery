"use client"

import {
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/core/button"
import { useVolumeStore } from "@/components/media/hooks/use-volume"
import { MuteControl } from "@/components/media/ui/mute-control"

export function VolumeStateControlDemo() {
  const muted = useVolumeStore((state) => state.muted)
  const volume = useVolumeStore((state) => state.level)

  return (
    <MuteControl asChild>
      <Button shape="square" variant="text">
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
