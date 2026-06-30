import { Rating, RatingButton } from "@/components/ui/rating"
import { Star } from "lucide-react"

export default function RatingBasicExample() {
  return (
    <Rating defaultValue={3} className="w-full max-w-sm">
      {Array.from({ length: 5 }, (_, i) => (
        <RatingButton key={i} icon={<Star />} />
      ))}
    </Rating>
  )
}
