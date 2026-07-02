import { CaptionsContainer } from "@/components/media/ui/captions"
import { CaptionsStateControl } from "@/components/media/blocks/video-player/components/captions-state-control"

export default function CaptionsStateControlBasicExample() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <CaptionsStateControl />
      <CaptionsContainer className="w-full" />
    </div>
  )
}
