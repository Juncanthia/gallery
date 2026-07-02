import { Counter } from "@/components/effects/interactions/counter"

export default function CounterBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <Counter value={12345} />
    </div>
  )
}
