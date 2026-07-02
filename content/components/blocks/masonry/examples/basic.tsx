import { Masonry } from "@/components/blocks/masonry"

const cards = [
  { id: 1, title: "Mountain View", height: "h-32" },
  { id: 2, title: "Lake Sunset", height: "h-48" },
  { id: 3, title: "City Skyline", height: "h-40" },
  { id: 4, title: "Forest Path", height: "h-56" },
  { id: 5, title: "Ocean Waves", height: "h-36" },
  { id: 6, title: "Desert Dunes", height: "h-44" },
]

export default function MasonryBasicExample() {
  return (
    <Masonry columns={3} gap={4} className="w-full">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`${card.height} rounded bg-muted p-4 text-sm font-medium`}
        >
          {card.title}
        </div>
      ))}
    </Masonry>
  )
}
