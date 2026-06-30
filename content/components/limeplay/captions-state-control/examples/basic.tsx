import { CaptionsContainer } from "@/components/ui/limeplay-captions"
import { CaptionsStateControl } from "@/components/ui/limeplay-captions-state-control"

export default function CaptionsStateControlBasicExample() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <CaptionsStateControl />
      <CaptionsContainer className="w-full" />
    </div>
  )
}
