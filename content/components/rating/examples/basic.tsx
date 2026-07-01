import { Rating } from "@/components/ui/rating"

export default function RatingBasicExample() {
  return (
    <div className="flex flex-col gap-3">
      <Rating defaultValue={3} />
      <Rating defaultValue={3.5} allowHalf clearable size="lg" />
    </div>
  )
}
