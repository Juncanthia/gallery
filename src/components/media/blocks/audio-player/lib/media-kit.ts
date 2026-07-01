"use client"

import { assetFeature } from "@/components/media/hooks/use-asset"
import { captionsFeature } from "@/components/media/hooks/use-captions"
import { mediaFeature } from "@/components/media/hooks/use-media"
import { playbackFeature } from "@/components/media/hooks/use-playback"
import { playerFeature } from "@/components/media/hooks/use-player"
import { playlistFeature } from "@/components/media/hooks/use-playlist"
import { timelineFeature } from "@/components/media/hooks/use-timeline"
import { volumeFeature } from "@/components/media/hooks/use-volume"
import { createMediaKit } from "@/components/media/ui/media-provider"

export const media = createMediaKit({
  features: [
    mediaFeature(),
    playerFeature(),
    playbackFeature(),
    playlistFeature(),
    volumeFeature(),
    timelineFeature(),
    captionsFeature(),
    assetFeature(),
  ] as const,
})

export const MediaProvider = media.MediaProvider
