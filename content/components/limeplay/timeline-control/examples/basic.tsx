"use client"

import * as TimelineControl from "@/components/ui/limeplay-timeline-control"

export default function Demo() {
  return (
    <div className="my-4 flex h-fit w-full flex-row items-center gap-3 rounded-md border p-3">
      <span className="text-xs font-medium tabular-nums">0:00</span>
      <div className="group/timeline relative w-full grow">
        <TimelineControl.Root
          className="group cursor-crosshair -focus-area-x-2 -focus-area-y-14"
          orientation="horizontal"
        >
          <TimelineControl.Track className="overflow-hidden">
            <TimelineControl.Progress />
            <TimelineControl.Buffered variant="combined" />
          </TimelineControl.Track>
          <TimelineControl.Thumb
            className="absolute h-8 w-px rounded-full bg-primary/60 opacity-0 transition-opacity duration-300 group-hover/timeline:opacity-100 group-active/timeline:bg-primary"
            showWithHover
          />
        </TimelineControl.Root>
      </div>
      <span className="text-xs font-medium tabular-nums">3:45</span>
    </div>
  )
}
