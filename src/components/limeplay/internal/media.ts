import { assetFeature } from "@hyper/limeplay/hooks/use-asset"
import { captionsFeature } from "@hyper/limeplay/hooks/use-captions"
import { mediaFeature } from "@hyper/limeplay/hooks/use-media"
import { pictureInPictureFeature } from "@hyper/limeplay/hooks/use-picture-in-picture"
import { playbackFeature } from "@hyper/limeplay/hooks/use-playback"
import { playbackRateFeature } from "@hyper/limeplay/hooks/use-playback-rate"
import { playerFeature } from "@hyper/limeplay/hooks/use-player"
import { playlistFeature } from "@hyper/limeplay/hooks/use-playlist"
import { timelineFeature } from "@hyper/limeplay/hooks/use-timeline"
import { volumeFeature } from "@hyper/limeplay/hooks/use-volume"
import { createMediaKit } from "@hyper/limeplay/ui/media-provider"

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
export const useMediaApi = media.useMediaApi
export const useMediaStore = media.useMediaStore
