import { BorderBeam } from "@/components/ui/border-beam"
export default function Bb() {
  return (
    <div className="relative h-24 w-64 overflow-hidden rounded border">
      <BorderBeam />
      <div className="flex h-full items-center justify-center text-sm">流光边框效果</div>
    </div>
  )
}
