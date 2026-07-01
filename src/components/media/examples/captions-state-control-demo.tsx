"use client"

import { ClosedCaptioningIcon } from "@phosphor-icons/react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useCaptionsStore } from "@/components/media/hooks/use-captions"
import {
  MediaReadyState,
  usePlaybackStore,
} from "@/components/media/hooks/use-playback"
import { usePlayerStore } from "@/components/media/hooks/use-player"
import {
  CaptionsContainer,
  CaptionsControl,
} from "@/components/media/ui/captions"

export function CaptionsHybridDemo() {
  return <CaptionsContainer className="mb-16" />
}

export function CaptionsStateControlDemo() {
  const textTrackVisible = useCaptionsStore((state) => state.visible)
  const player = usePlayerStore((state) => state.instance) as unknown as {
    selectTextTrack(track: unknown): void
    getTextTracks(): unknown[]
    setTextTrackVisibility(visible: boolean): Promise<void> | void
    addTextTrack(...args: unknown[]): Promise<unknown>
    addTextTrackAsync(...args: unknown[]): Promise<unknown>
  } | null
  const readyState = usePlaybackStore((state) => state.readyState)

  // DEV: Adding text tracks externally as demo asset doesn't have built-in text tracks
  useEffect(() => {
    if (!player || readyState < MediaReadyState.HAVE_METADATA) return

    player
      .addTextTrackAsync(
        "/assets/sprite_fight.vtt",
        "en",
        "captions",
        "text/vtt",
        undefined,
        "English"
      )
      .then(() => {
        player.selectTextTrack(player.getTextTracks()[0])
        player.setTextTrackVisibility(true)
      })
      .catch((error: unknown) => {
        console.error("Error adding text track:", error)
      })
  }, [readyState, player])

  return (
    <CaptionsControl asChild>
      <Button shape="square" variant="text">
        <ClosedCaptioningIcon
          size={18}
          weight={textTrackVisible ? "fill" : "regular"}
        />
      </Button>
    </CaptionsControl>
  )
}
