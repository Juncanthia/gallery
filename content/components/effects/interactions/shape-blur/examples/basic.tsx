import { ShapeBlur } from "@/components/effects/interactions/shape-blur"

export default function ShapeBlurBasicExample() {
  return (
    <div className="h-64 w-full">
      <ShapeBlur
        variation={0}
        shapeSize={1.2}
        roundness={0.4}
        borderSize={0.05}
        circleSize={0.3}
      />
    </div>
  )
}
