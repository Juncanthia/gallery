import { CardSwap, Card } from "@/components/ui/rb-card-swap"

export default function CardSwapBasicExample() {
  return (
    <CardSwap>
      <Card style={{ backgroundColor: "#3b82f6" }}>
        <div className="flex h-full items-center justify-center text-white text-xl font-bold">Card 1</div>
      </Card>
      <Card style={{ backgroundColor: "#10b981" }}>
        <div className="flex h-full items-center justify-center text-white text-xl font-bold">Card 2</div>
      </Card>
      <Card style={{ backgroundColor: "#f59e0b" }}>
        <div className="flex h-full items-center justify-center text-white text-xl font-bold">Card 3</div>
      </Card>
      <Card style={{ backgroundColor: "#ef4444" }}>
        <div className="flex h-full items-center justify-center text-white text-xl font-bold">Card 4</div>
      </Card>
    </CardSwap>
  )
}
