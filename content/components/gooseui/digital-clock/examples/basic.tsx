import { DigitalClock } from "@/components/ui/digital-clock"

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <DigitalClock showSeconds />
      <DigitalClock use24Hour={false} scale={0.8} />
      <DigitalClock color="#ff6b6b" showSeconds use24Hour />
    </div>
  )
}
