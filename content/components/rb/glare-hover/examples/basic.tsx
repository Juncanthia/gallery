import { GlareHover } from "@/components/ui/glare-hover"

export default function GlareHoverBasicExample() {
  return (
    <GlareHover>
      <div className="flex h-full items-center justify-center text-white">
        <p>Hover to see glare effect</p>
      </div>
    </GlareHover>
  )
}
