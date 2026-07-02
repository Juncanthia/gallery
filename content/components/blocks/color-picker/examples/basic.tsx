import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput } from "@/components/core/color-picker"

export default function ColorPickerBasicExample() {
  return (
    <ColorPicker defaultValue="#1677ff" className="w-60 gap-3">
      <ColorPickerSelection className="h-32 rounded-md" />
      <ColorPickerHue />
      <ColorPickerAlpha />
      <ColorPickerOutput />
    </ColorPicker>
  )
}
