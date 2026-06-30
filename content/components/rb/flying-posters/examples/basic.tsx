import { FlyingPosters } from "@/components/ui/rb-flying-posters"

const defaultImages = [
  "https://picsum.photos/seed/fp1/320/320",
  "https://picsum.photos/seed/fp2/320/320",
  "https://picsum.photos/seed/fp3/320/320",
  "https://picsum.photos/seed/fp4/320/320",
  "https://picsum.photos/seed/fp5/320/320",
]

export default function FlyingPostersBasicExample() {
  return (
    <div className="h-[500px] w-full">
      <FlyingPosters items={defaultImages} />
    </div>
  )
}
