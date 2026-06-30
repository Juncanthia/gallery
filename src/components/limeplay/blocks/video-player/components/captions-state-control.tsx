"use client"

import { ClosedCaptioningIcon } from "@phosphor-icons/react"

import { Button } from "@hyper/limeplay/blocks/video-player/components/button"
import { useCaptionsStore } from "@hyper/limeplay/hooks/use-captions"
import { CaptionsControl } from "@hyper/limeplay/ui/captions"

export function CaptionsStateControl() {
  const textTrackVisible = useCaptionsStore((state) => state.visible)

  return (
    <CaptionsControl asChild>
      <Button className="cursor-pointer" size="icon" variant="glass">
        <ClosedCaptioningIcon weight={textTrackVisible ? "fill" : "regular"} />
      </Button>
    </CaptionsControl>
  )
}
