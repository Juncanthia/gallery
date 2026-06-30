"use client"

import { Target } from "lucide-react"
import { Hitbox } from "@/components/ui/dice-hitbox"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">无 hitbox</span>
        <button className="inline-flex size-8 items-center justify-center rounded border bg-background text-foreground hover:bg-muted">
          <Target className="size-3.5" />
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">default</span>
        <Hitbox debug size="default">
          <button className="inline-flex size-8 items-center justify-center rounded border bg-background text-foreground hover:bg-muted">
            <Target className="size-3.5" />
          </button>
        </Hitbox>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">sm</span>
        <Hitbox debug size="sm">
          <button className="inline-flex size-8 items-center justify-center rounded border bg-background text-foreground hover:bg-muted">
            <Target className="size-3.5" />
          </button>
        </Hitbox>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">lg</span>
        <Hitbox debug size="lg">
          <button className="inline-flex size-8 items-center justify-center rounded border bg-background text-foreground hover:bg-muted">
            <Target className="size-3.5" />
          </button>
        </Hitbox>
      </div>
    </div>
  )
}
