import { LegacyClock } from "@/components/_internal/sabraman"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <LegacyClock />
      <LegacyClock variant="night" />
      <LegacyClock size={120} />
      <LegacyClock showSeconds={false} />
      <LegacyClock withShadow={false} />
    </div>
  )
}
