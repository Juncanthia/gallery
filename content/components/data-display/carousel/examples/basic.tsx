import { Coursel } from "@/components/data-display/carousel"

const images = [
  "https://picsum.photos/seed/1/400/450",
  "https://picsum.photos/seed/2/400/450",
  "https://picsum.photos/seed/3/400/450",
  "https://picsum.photos/seed/4/400/450",
  "https://picsum.photos/seed/5/400/450",
]

export default function Demo() {
  return (
    <div className="flex items-center justify-center py-8">
      <Coursel images={images} />
    </div>
  )
}
