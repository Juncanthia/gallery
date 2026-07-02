import { MetallicPaint } from "@/components/effects/interactions/metallic-paint"

export default function MetallicPaintBasicExample() {
  return (
    <div className="h-64 w-full">
      <MetallicPaint
        imageSrc="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=500&fit=crop"
        liquid={0.8}
        brightness={2}
        contrast={0.5}
      />
    </div>
  )
}
