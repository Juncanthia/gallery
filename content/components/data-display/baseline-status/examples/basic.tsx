import { BaselineStatus } from "@/components/data-display/status"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <BaselineStatus featureId="container-queries" />
      <BaselineStatus featureId="has" size="sm" />
      <BaselineStatus blocks/status="widely" year={2022} />
      <BaselineStatus blocks/status="newly" year={2024} />
      <BaselineStatus blocks/status="limited" year={2024} />
      <BaselineStatus blocks/status="widely" year={2022} iconOnly />
    </div>
  )
}
