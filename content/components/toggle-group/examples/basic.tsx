import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"
export default function Tg() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="加粗"><Bold className="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="斜体"><Italic className="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="下划线"><Underline className="size-4" /></ToggleGroupItem>
    </ToggleGroup>
  )
}
