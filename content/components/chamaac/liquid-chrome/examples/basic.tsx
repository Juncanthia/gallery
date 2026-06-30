import LiquidChrome from "@/components/ui/chamaac-liquid-chrome"

export default function Demo() {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border bg-slate-950">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            Liquid Chrome
          </h3>
          <p className="mt-1 text-sm text-white/70 drop-shadow-md">
            流动金属质感背景
          </p>
        </div>
      </div>
      <LiquidChrome
        speed={0.35}
        timeScale={0.225}
        color="#C0C0C0"
        color2="#4A4A4A"
      />
    </div>
  )
}
