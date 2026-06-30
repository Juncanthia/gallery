import { GlitchText } from "@/components/ui/gooseui-glitch-text"

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <GlitchText text="GLITCH TEXT" intensity="low" showScanlines={false} showGlow={false} />
      <GlitchText text="HACK THE PLANET" intensity="medium" />
      <GlitchText text="CYBERPUNK" intensity="high" color="#00ff88" />
    </div>
  )
}
