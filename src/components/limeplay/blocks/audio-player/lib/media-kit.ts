"use client"

import { assetFeature } from "@/components/limeplay/hooks/use-asset"
import { captionsFeature } from "@/components/limeplay/hooks/use-captions"
import { mediaFeature } from "@/components/limeplay/hooks/use-media"
import { playbackFeature } from "@/components/limeplay/hooks/use-playback"
import { playerFeature } from "@/components/limeplay/hooks/use-player"
import { playlistFeature } from "@/components/limeplay/hooks/use-playlist"
import { timelineFeature } from "@/components/limeplay/hooks/use-timeline"
import { volumeFeature } from "@/components/limeplay/hooks/use-volume"
import { createMediaKit } from "@/components/limeplay/ui/media-provider"

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
