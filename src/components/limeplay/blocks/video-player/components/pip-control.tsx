"use client"

import { PictureInPictureIcon } from "@phosphor-icons/react"

import { Button } from "@hyper/limeplay/blocks/video-player/components/button"
import { usePictureInPictureStore } from "@hyper/limeplay/hooks/use-picture-in-picture"
import { PictureInPictureControl as PictureInPictureControlPrimitive } from "@hyper/limeplay/ui/picture-in-picture-control"

export function PictureInPictureControl() {
  const isPictureInPictureActive = usePictureInPictureStore(
    (state) => state.active
  )

  return (
    <PictureInPictureControlPrimitive asChild shortcut="P">
      <Button className="cursor-pointer" size="icon" variant="glass">
        <PictureInPictureIcon
          weight={isPictureInPictureActive ? "fill" : "regular"}
        />
      </Button>
    </PictureInPictureControlPrimitive>
  )
}
