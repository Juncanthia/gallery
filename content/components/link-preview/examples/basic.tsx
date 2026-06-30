import { PreviewLinkCard, PreviewLinkCardTrigger, PreviewLinkCardContent } from "@/components/ui/link-preview"

export default function LinkPreviewBasicExample() {
  return (
    <PreviewLinkCard className="w-64">
      <PreviewLinkCardTrigger href="https://example.com" className="text-sm underline">
        悬停或点击查看预览
      </PreviewLinkCardTrigger>
      <PreviewLinkCardContent>
        <div className="text-sm">链接预览卡片内容</div>
      </PreviewLinkCardContent>
    </PreviewLinkCard>
  )
}
