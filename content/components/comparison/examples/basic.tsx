import {
  Comparison,
  ComparisonItem,
  ComparisonHandle,
} from "@/components/ui/comparison"

export default function ComparisonBasicExample() {
  return (
    <Comparison className="w-full max-w-sm h-64 rounded-lg overflow-hidden">
      <ComparisonItem position="left">
        <img
          alt="Original"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
        />
      </ComparisonItem>
      <ComparisonItem position="right">
        <img
          alt="Edited"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop"
        />
      </ComparisonItem>
      <ComparisonHandle />
    </Comparison>
  )
}
