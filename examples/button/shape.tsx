import { Search } from "lucide-react"

import { Button } from "@/components/base/button"

export default function ButtonShapeExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button shape="default">默认</Button>
      <Button shape="round">圆角</Button>
      <Button shape="circle" icon={<Search />} aria-label="搜索" />
      <Button shape="square" icon={<Search />} aria-label="搜索" />
    </div>
  )
}
