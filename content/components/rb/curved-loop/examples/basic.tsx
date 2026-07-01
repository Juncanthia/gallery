import { CurvedLoop } from "@/components/ui/curved-loop"

export default function CurvedLoopBasicExample() {
  return (
    <div className="w-full h-32">
      <CurvedLoop
        marqueeText="REACT BITS • "
        className="text-2xl fill-current"
      />
    </div>
  )
}
