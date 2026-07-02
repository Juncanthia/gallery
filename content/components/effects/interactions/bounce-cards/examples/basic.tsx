import { BounceCards } from "@/components/effects/interactions/bounce-cards"

export default function BounceCardsBasicExample() {
  return (
    <BounceCards
      images={[
        "https://picsum.photos/seed/1/400/400",
        "https://picsum.photos/seed/2/400/400",
        "https://picsum.photos/seed/3/400/400",
        "https://picsum.photos/seed/4/400/400",
        "https://picsum.photos/seed/5/400/400",
      ]}
    />
  )
}
