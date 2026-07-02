import { Toggle } from "@/components/core/toggle"
import { Bold, Italic, Underline } from "lucide-react"

export default function ToggleBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="加粗"><Bold className="size-4" /></Toggle>
      <Toggle aria-label="斜体"><Italic className="size-4" /></Toggle>
      <Toggle aria-label="下划线"><Underline className="size-4" /></Toggle>
      <Toggle disabled><Bold className="size-4" /></Toggle>
    </div>
  )
}
