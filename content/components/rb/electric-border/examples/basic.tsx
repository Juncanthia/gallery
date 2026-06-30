import { ElectricBorder } from "@/components/ui/rb-electric-border"

export default function ElectricBorderBasicExample() {
  return (
    <ElectricBorder>
      <div className="px-8 py-12 text-center text-white">
        <h2 className="text-xl font-bold">Electric Border</h2>
        <p className="mt-2 text-neutral-400">A dynamic animated border effect</p>
      </div>
    </ElectricBorder>
  )
}
