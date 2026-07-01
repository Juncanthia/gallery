import { CaptionsContainer } from "@/components/ui/captions"
import { CaptionsStateControl } from "@/components/ui/captions-state-control"

export default function CaptionsStateControlBasicExample() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <CaptionsStateControl />
      <CaptionsContainer className="w-full" />
    </div>
  )
}
