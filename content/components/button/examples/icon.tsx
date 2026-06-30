import { ArrowRight, Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonIconExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button color="primary" icon={<Search />} variant="solid">
        搜索
      </Button>
      <Button icon={<Download />} variant="outlined">
        下载
      </Button>
      <Button icon={<ArrowRight />} iconPlacement="end">
        下一步
      </Button>
      <Button color="primary" icon={<Search />} variant="solid" aria-label="搜索" />
    </div>
  )
}
