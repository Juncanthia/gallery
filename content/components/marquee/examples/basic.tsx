import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "@/components/ui/marquee"

const items = [
  "System maintenance scheduled for July 5th at 2:00 AM UTC",
  "New dashboard analytics are now available for all teams",
  "Please update your API keys before July 15th deadline",
  "Welcome new team members: Alice, Bob, and Charlie",
  "Quarterly performance review submissions open next week",
]

export default function MarqueeBasicExample() {
  return (
    <Marquee>
      <MarqueeContent pauseOnHover speed={50}>
        {items.map((text, index) => (
          <MarqueeItem key={index}>
            <span className="inline-flex items-center rounded-full border bg-secondary px-3 py-1 font-medium text-secondary-foreground text-xs">
              {text}
            </span>
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>
  )
}
