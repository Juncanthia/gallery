import { TargetCursor } from "@/components/ui/rb-target-cursor"

export default function TargetCursorBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <TargetCursor
        targetSelector=".cursor-target"
        cursorColor="#ffffff"
      />
      <div className="cursor-target rounded-lg border border-white/20 px-6 py-3 text-white">
        Hover me
      </div>
    </div>
  )
}
