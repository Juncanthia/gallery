import { FocusButton } from "@/components/general/chamaac/focus-button/focus-button"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-8">
      <FocusButton>Focus Button</FocusButton>
      <FocusButton dashColor="#3b82f6">Custom Color</FocusButton>
      <FocusButton className="px-8 py-4 text-lg">Large</FocusButton>
    </div>
  )
}
