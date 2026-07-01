import { Magnet } from "@/components/ui/magnet"

export default function MagnetBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <Magnet padding={100} magnetStrength={10}>
        <button className="rounded px-6 py-3 text-sm font-medium bg-black text-white dark:bg-white dark:text-black">
          Hover me
        </button>
      </Magnet>
    </div>
  )
}
