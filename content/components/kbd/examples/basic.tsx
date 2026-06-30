import { Kbd } from "@/components/ui/kbd"

export default function KbdBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <Kbd>⌘ + K</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>↵</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  )
}
