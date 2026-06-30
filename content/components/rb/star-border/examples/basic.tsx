import { StarBorder } from "@/components/ui/rb-star-border"

export default function StarBorderBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <StarBorder color="white" speed="6s">
        Star Border
      </StarBorder>
    </div>
  )
}
