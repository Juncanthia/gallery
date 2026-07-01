import { Aurora } from "@/components/ui/aurora"

export default function AuroraBasicExample() {
  return (
    <div className="h-64 w-full overflow-hidden rounded">
      <Aurora
        colorStops={["#5227FF", "#7cff67", "#5227FF"]}
        amplitude={1.0}
        blend={0.5}
      />
    </div>
  )
}
