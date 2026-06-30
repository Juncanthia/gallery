import { Squircle } from "@/components/ui/gooseui-corner-shape"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <Squircle
        n={4}
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600"
      />
      <Squircle
        n={5}
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600"
      />
      <Squircle
        n={6}
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600"
      />
      <Squircle
        n={8}
        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600"
      />
    </div>
  )
}
