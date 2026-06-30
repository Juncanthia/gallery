import { Counter } from "@/components/ui/rb-counter"

export default function CounterBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <Counter value={12345} />
    </div>
  )
}
