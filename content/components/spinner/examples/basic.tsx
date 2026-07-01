import { Spinner } from "@/components/blocks/spinner"

const variants = [
  "default",
  "throbber",
  "pinwheel",
  "circle-filled",
  "ellipsis",
  "ring",
  "bars",
  "infinite",
] as const

export default function SpinnerBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-1.5">
          <Spinner variant={variant} />
          <span className="text-xs text-muted-foreground">{variant}</span>
        </div>
      ))}
    </div>
  )
}
