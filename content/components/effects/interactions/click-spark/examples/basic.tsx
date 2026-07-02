import { ClickSpark } from "@/components/effects/interactions/click-spark"

export default function ClickSparkBasicExample() {
  return (
    <ClickSpark>
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-neutral-800 text-neutral-400">
        Click anywhere to see sparks
      </div>
    </ClickSpark>
  )
}
