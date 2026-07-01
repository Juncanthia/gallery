import { MagnetLines } from "@/components/ui/magnet-lines"

export default function MagnetLinesBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <MagnetLines
        rows={9}
        columns={9}
        containerSize="60vmin"
        lineColor="#efefef"
        lineWidth="1vmin"
        lineHeight="5vmin"
      />
    </div>
  )
}
