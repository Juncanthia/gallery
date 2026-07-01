import { AnimatedTimer } from "@/components/data-display/gooseui/animated-timer"

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">24h + 秒</span>
        <AnimatedTimer />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">12h + 秒</span>
        <AnimatedTimer use24Hour={false} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">仅时:分</span>
        <AnimatedTimer showSeconds={false} />
      </div>
    </div>
  )
}
