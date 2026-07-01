import { VideoPlayer } from "@/components/ui/video-player-limeplay"

const DEMO_SRC =
  "https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/master/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8"

export default function VideoPlayerBasicExample() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-3xl">
        <VideoPlayer className="aspect-video" source={DEMO_SRC} />
      </div>
    </div>
  )
}
