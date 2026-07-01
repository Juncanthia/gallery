import { BorderBeam } from "@/components/effects/interactions/gooseui/border-beam"

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative overflow-hidden rounded-xl border bg-card p-8 shadow">
        <h3 className="text-lg font-semibold">边框流光</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          BorderBeam 绕容器边缘旋转，产生渐变流光边框效果。
        </p>
        <BorderBeam
          size={250}
          duration={8}
          delay={0}
          colorFrom="#ffaa40"
          colorTo="#9c40ff"
          borderWidth={2}
        />
      </div>
    </div>
  )
}
