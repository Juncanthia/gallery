import { Deck, DeckCards, DeckItem } from "@/components/blocks/deck"

export default function DeckBasicExample() {
  return (
    <Deck className="w-full max-w-sm h-64">
      <DeckCards>
        <DeckItem className="flex flex-col items-center justify-center gap-2 bg-blue-100 text-blue-800">
          <span className="text-lg font-semibold">Task 1</span>
          <span className="text-sm text-blue-600">
            Review the pull request
          </span>
        </DeckItem>
        <DeckItem className="flex flex-col items-center justify-center gap-2 bg-green-100 text-green-800">
          <span className="text-lg font-semibold">Task 2</span>
          <span className="text-sm text-green-600">Deploy to staging</span>
        </DeckItem>
        <DeckItem className="flex flex-col items-center justify-center gap-2 bg-purple-100 text-purple-800">
          <span className="text-lg font-semibold">Task 3</span>
          <span className="text-sm text-purple-600">
            Update documentation
          </span>
        </DeckItem>
      </DeckCards>
    </Deck>
  )
}
