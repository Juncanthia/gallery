import { CaptionsStateControl } from "@/components/media/blocks/video-player/components/captions-state-control"
import { PictureInPictureControl } from "@/components/media/blocks/video-player/components/pip-control"
import { PlaybackRateControl } from "@/components/media/blocks/video-player/components/playback-rate-control"
import { PlaybackStateControl } from "@/components/media/blocks/video-player/components/playback-state-control"
import { Playlist } from "@/components/media/blocks/video-player/components/playlist"
import { PlaylistNextControl } from "@/components/media/blocks/video-player/components/playlist-navigation-controls"
import { TimelineSliderControl } from "@/components/media/blocks/video-player/components/timeline-slider-control"
import { VolumeGroupControl } from "@/components/media/blocks/video-player/components/volume-group-control"
import * as Layout from "@/components/media/ui/player-layout"

export function BottomControls() {
  return (
    <Layout.ControlsBottomContainer>
      <PlaybackStateControl />
      <PlaylistNextControl />
      <VolumeGroupControl />
      <TimelineSliderControl />
      <PlaybackRateControl />
      <CaptionsStateControl />
      <PictureInPictureControl />
      <Playlist />
    </Layout.ControlsBottomContainer>
  )
}
