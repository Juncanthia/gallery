"use client"

import { assetFeature } from "@/_internals/domains/media/hooks/use-asset"
import { captionsFeature } from "@/_internals/domains/media/hooks/use-captions"
import { mediaFeature } from "@/_internals/domains/media/hooks/use-media"
import { pictureInPictureFeature } from "@/_internals/domains/media/hooks/use-picture-in-picture"
import { playbackFeature } from "@/_internals/domains/media/hooks/use-playback"
import { playbackRateFeature } from "@/_internals/domains/media/hooks/use-playback-rate"
import { playerFeature } from "@/_internals/domains/media/hooks/use-player"
import { playlistFeature } from "@/_internals/domains/media/hooks/use-playlist"
import { timelineFeature } from "@/_internals/domains/media/hooks/use-timeline"
import { volumeFeature } from "@/_internals/domains/media/hooks/use-volume"
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
    playbackRateFeature(),
    pictureInPictureFeature(),
    assetFeature(),
  ] as const,
})

export const MediaProvider = media.MediaProvider
export const useMediaEvents = media.useMediaEvents
