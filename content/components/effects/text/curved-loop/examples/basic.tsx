import { CurvedLoop } from "@/components/effects/text/curved-loop"

export default function CurvedLoopBasicExample() {
  return (
    <div className="w-full h-32">
      <CurvedLoop
        blocks/marqueeText="REACT BITS • "
        className="text-2xl fill-current"
      />
    </div>
  )
}
