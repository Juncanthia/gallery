import { ElectricMist } from "@/components/ui/electric-mist"

export default function Demo() {
  return (
    <div className="relative w-full h-64 rounded overflow-hidden">
      <ElectricMist />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white/70 text-lg font-medium drop-shadow-lg">
          Electric Mist
        </p>
      </div>
    </div>
  )
}
