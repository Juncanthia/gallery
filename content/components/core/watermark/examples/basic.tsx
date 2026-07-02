import { Watermark } from "@/components/core/watermark"
export default function Wm() {
  return (
    <Watermark content="机密文档" className="h-40 w-full rounded border">
      <div className="flex h-full items-center justify-center p-4 text-sm">受保护的内容区域</div>
    </Watermark>
  )
}
