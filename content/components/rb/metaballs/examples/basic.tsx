import { MetaBalls } from "@/components/ui/metaballs"

export default function MetaBallsBasicExample() {
  return (
    <div className="h-64 w-full">
      <MetaBalls
        color="#ffffff"
        cursorBallColor="#ffffff"
        ballCount={15}
      />
    </div>
  )
}
