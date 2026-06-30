import { StickerPeel } from "@/components/ui/rb-sticker-peel"

export default function StickerPeelBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <StickerPeel
        imageSrc="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop"
        width={200}
        rotate={30}
        peelDirection={0}
      />
    </div>
  )
}
