import { Balatro } from "@/components/effects/backgrounds/balatro"

export default function BalatroBasicExample() {
  return (
    <div className="h-64 w-full overflow-hidden rounded">
      <Balatro
        color1="#DE443B"
        color2="#006BB4"
        color3="#162325"
        contrast={3.5}
        mouseInteraction={true}
      />
    </div>
  )
}
