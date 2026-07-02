"use client"

import { ActionControls } from "@/components/media/blocks/audio-player/components/action-controls"
import { TimeLabels } from "@/components/media/blocks/audio-player/components/fixed-timeline-control"
import { PlaybackControls } from "@/components/media/blocks/audio-player/components/playback-controls"
import {
  RepeatControl,
  ShuffleControl,
} from "@/components/media/blocks/audio-player/components/playback-mode-controls"
import { Playlist } from "@/components/media/blocks/audio-player/components/playlist"
import { TrackInfo } from "@/components/media/blocks/audio-player/components/track-info"
import { VolumeControl } from "@/components/media/blocks/audio-player/components/volume-group-control"
import {
  AssetSourceType,
  useAssetStore,
} from "@/_internals/domains/media/hooks/use-asset"
import { usePlaylistStore } from "@/_internals/domains/media/hooks/use-playlist"

export function PlayerControls() {
  const sourceType = useAssetStore((state) => state.sourceType)
  const queueLength = usePlaylistStore((state) => state.queue.length)
  const isPlaylistMode =
    sourceType === AssetSourceType.Playlist || queueLength > 1

  return (
    <div className="grid h-full grid-cols-3 items-center px-4">
      <div className="flex items-center justify-start gap-4">
        <PlaybackControls showNavigation={isPlaylistMode} />
        <TimeLabels />
      </div>
      <div className="flex items-center justify-center gap-2">
        <TrackInfo />
        <ActionControls />
      </div>
      <div className="flex items-center justify-end gap-2">
        <VolumeControl />
        <RepeatControl variant={isPlaylistMode ? "playlist" : "asset"} />
        {isPlaylistMode ? (
          <>
            <ShuffleControl />
            <Playlist />
          </>
        ) : null}
      </div>
    </div>
  )
}
