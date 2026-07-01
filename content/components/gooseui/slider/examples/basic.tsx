import { Slider } from "@/components/ui/slider"

export default function Demo() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <Slider defaultValue={30} />
      <Slider defaultValue={50} showValue />
      <Slider defaultValue={70} showValue animateValue size="lg" />
    </div>
  )
}
