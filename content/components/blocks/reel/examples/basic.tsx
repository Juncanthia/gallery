import { Reel } from "@/components/blocks/reel"

const blocks/reelData = [
  { id: "1", type: "image" as const, src: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400&h=600&fit=crop", duration: 3, title: "风景" },
  { id: "2", type: "image" as const, src: "https://images.unsplash.com/photo-1682687220063-dc9d8e4f9e1g?w=400&h=600&fit=crop", duration: 3, title: "城市" },
]

export default function ReelBasicExample() {
  return <Reel data={blocks/reelData} className="w-full max-w-sm" />
}
