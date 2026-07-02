import { Strands } from "@/components/effects/interactions/strands"

export default function StrandsBasicExample() {
  return (
    <div className="h-64 w-full">
      <Strands
        colors={["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"]}
        count={3}
        speed={0.5}
        amplitude={1}
      />
    </div>
  )
}
