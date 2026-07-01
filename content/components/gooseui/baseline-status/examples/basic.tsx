import { BaselineStatus } from "@/components/data-display/gooseui/baseline-status"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <BaselineStatus featureId="container-queries" />
      <BaselineStatus featureId="has" size="sm" />
      <BaselineStatus status="widely" year={2022} />
      <BaselineStatus status="newly" year={2024} />
      <BaselineStatus status="limited" year={2024} />
      <BaselineStatus status="widely" year={2022} iconOnly />
    </div>
  )
}
