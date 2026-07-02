"use client"

import { PictureInPictureIcon } from "@phosphor-icons/react"

import { Button } from "@/components/core/button"
import { PictureInPictureControl } from "@/components/media/ui/picture-in-picture-control"
import { usePictureInPictureStore } from "@/components/media/hooks/use-picture-in-picture"

export default function Demo() {
  const isPictureInPictureActive = usePictureInPictureStore(
    (state) => state.active
  )

  return (
    <PictureInPictureControl asChild shortcut="P">
      <Button size="icon" variant="ghost">
        <PictureInPictureIcon
          weight={isPictureInPictureActive ? "fill" : "regular"}
        />
      </Button>
    </PictureInPictureControl>
  )
}
