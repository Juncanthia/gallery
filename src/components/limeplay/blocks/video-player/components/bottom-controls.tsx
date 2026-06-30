import { CaptionsStateControl } from "@hyper/limeplay/blocks/video-player/components/captions-state-control"
import { PictureInPictureControl } from "@hyper/limeplay/blocks/video-player/components/pip-control"
import { PlaybackRateControl } from "@hyper/limeplay/blocks/video-player/components/playback-rate-control"
import { PlaybackStateControl } from "@hyper/limeplay/blocks/video-player/components/playback-state-control"
import { Playlist } from "@hyper/limeplay/blocks/video-player/components/playlist"
import { PlaylistNextControl } from "@hyper/limeplay/blocks/video-player/components/playlist-navigation-controls"
import { TimelineSliderControl } from "@hyper/limeplay/blocks/video-player/components/timeline-slider-control"
import { VolumeGroupControl } from "@hyper/limeplay/blocks/video-player/components/volume-group-control"
import * as Layout from "@hyper/limeplay/ui/player-layout"

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
