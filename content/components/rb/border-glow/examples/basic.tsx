import { BorderGlow } from "@/components/ui/rb-border-glow"

export default function BorderGlowBasicExample() {
  return (
    <BorderGlow>
      <div className="flex flex-col items-center justify-center p-8 text-white">
        <h3 className="text-xl font-bold">Border Glow</h3>
        <p className="text-sm text-gray-400">Hover to see the glow effect</p>
      </div>
    </BorderGlow>
  )
}
