import { PlaybackRateControl } from "@/components/ui/playback-rate-control"

export default function Demo() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">播放速率</span>
      <PlaybackRateControl />
    </div>
  )
}
