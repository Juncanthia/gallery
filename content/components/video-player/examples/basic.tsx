import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerMuteButton,
  VideoPlayerVolumeRange,
} from "@/components/blocks/video-player"

export default function VideoPlayerBasicExample() {
  return (
    <VideoPlayer className="w-full max-w-2xl">
      <VideoPlayerContent
        slot="media"
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        crossOrigin=""
      />
      <VideoPlayerControlBar>
        <VideoPlayerPlayButton />
        <VideoPlayerSeekBackwardButton />
        <VideoPlayerSeekForwardButton />
        <VideoPlayerTimeDisplay />
        <VideoPlayerTimeRange />
        <VideoPlayerMuteButton />
        <VideoPlayerVolumeRange />
      </VideoPlayerControlBar>
    </VideoPlayer>
  )
}
