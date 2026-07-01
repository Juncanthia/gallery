import { Dock } from "@/components/ui/dock-rb"

export default function DockBasicExample() {
  return (
    <div className="flex items-end justify-center h-64 w-full">
      <Dock
        items={[
          { icon: <span className="text-white text-sm">A</span>, label: "App A" },
          { icon: <span className="text-white text-sm">B</span>, label: "App B" },
          { icon: <span className="text-white text-sm">C</span>, label: "App C" },
          { icon: <span className="text-white text-sm">D</span>, label: "App D" },
        ]}
      />
    </div>
  )
}
