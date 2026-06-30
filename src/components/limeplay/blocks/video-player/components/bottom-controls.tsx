import { CaptionsStateControl } from "@/components/limeplay/blocks/video-player/components/captions-state-control"
import { PictureInPictureControl } from "@/components/limeplay/blocks/video-player/components/pip-control"
import { PlaybackRateControl } from "@/components/limeplay/blocks/video-player/components/playback-rate-control"
import { PlaybackStateControl } from "@/components/limeplay/blocks/video-player/components/playback-state-control"
import { Playlist } from "@/components/limeplay/blocks/video-player/components/playlist"
import { PlaylistNextControl } from "@/components/limeplay/blocks/video-player/components/playlist-navigation-controls"
import { TimelineSliderControl } from "@/components/limeplay/blocks/video-player/components/timeline-slider-control"
import { VolumeGroupControl } from "@/components/limeplay/blocks/video-player/components/volume-group-control"
import * as Layout from "@/components/limeplay/ui/player-layout"

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
