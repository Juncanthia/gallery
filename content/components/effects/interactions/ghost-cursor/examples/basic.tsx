import { GhostCursor } from "@/components/effects/interactions/ghost-cursor"

export default function GhostCursorBasicExample() {
  return (
    <div className="relative h-[400px] w-full rounded-lg bg-neutral-900">
      <GhostCursor />
      <div className="flex h-full items-center justify-center text-neutral-400">
        Move cursor to see ghost trail
      </div>
    </div>
  )
}
