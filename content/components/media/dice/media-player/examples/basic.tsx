import { VideoPlayer } from "@/components/media/blocks/video-player/components/media-player"

const DEMO_SRC =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

export default function Demo() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-3xl">
        <VideoPlayer className="aspect-video" source={DEMO_SRC} />
      </div>
    </div>
  )
}
