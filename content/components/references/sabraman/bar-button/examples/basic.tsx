import { Search, Download, ChevronRight } from "lucide-react"
import { LegacyBarButton } from "@/components/legacy-ui"

export default function Demo() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <LegacyBarButton label="默认" />
        <LegacyBarButton label="主色" variant="accent" />
        <LegacyBarButton label="危险" variant="destructive" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LegacyBarButton icon={<Search />} />
        <LegacyBarButton icon={<Download />} variant="accent" />
        <LegacyBarButton icon={<ChevronRight />} variant="destructive" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LegacyBarButton icon={<Search />} label="搜索" />
        <LegacyBarButton icon={<Download />} label="下载" trailingIcon={<ChevronRight />} variant="accent" />
        <LegacyBarButton icon={<Search />} label="删除" variant="destructive" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LegacyBarButton label="返回" layout="backward" />
        <LegacyBarButton label="上一级" layout="backward" variant="accent" />
        <LegacyBarButton label="撤销" layout="backward" variant="destructive" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LegacyBarButton disabled label="禁用" />
        <LegacyBarButton disabled icon={<Search />} variant="accent" />
        <LegacyBarButton disabled icon={<Download />} label="下载" variant="destructive" />
      </div>
    </div>
  )
}
