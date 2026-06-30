import { Info } from "lucide-react"
import { Marker, MarkerIcon, MarkerContent } from "@/components/ui/marker"

export default function MarkerBasicExample() {
  return (
    <div className="w-full space-y-4">
      <Marker>
        <MarkerIcon>
          <Info />
        </MarkerIcon>
        <MarkerContent>
          这是一条提示信息，可包含 <a href="#">链接</a>。
        </MarkerContent>
      </Marker>

      <Marker variant="separator">
        <MarkerContent>我是分隔文本</MarkerContent>
      </Marker>

      <Marker variant="border">
        <MarkerContent>下方有分隔线的标记</MarkerContent>
      </Marker>
    </div>
  )
}
