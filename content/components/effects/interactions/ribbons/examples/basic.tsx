import { Ribbons } from "@/components/effects/interactions/ribbons"

export default function RibbonsBasicExample() {
  return (
    <div className="h-64 w-full">
      <Ribbons
        colors={["#FC8EAC", "#7C3AED", "#06B6D4"]}
        baseThickness={30}
        speedMultiplier={0.6}
      />
    </div>
  )
}
