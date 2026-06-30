import { ThemeCustomizer, ThemeCustomizerBar } from "@/components/ui/gooseui-theme-customizer"

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="relative flex h-16 items-center justify-center">
        <ThemeCustomizer inline />
      </div>
      <ThemeCustomizerBar />
    </div>
  )
}
