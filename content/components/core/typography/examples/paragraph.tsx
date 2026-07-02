import { Paragraph, Link } from "@/components/core/typography"

export default function TypographyParagraphExample() {
  return (
    <div className="max-w-md space-y-4">
      <Paragraph>
        这是正文段落，用于承载长文本内容。段落间自动保留间距。
      </Paragraph>
      <Paragraph type="secondary">
        使用 type=&quot;secondary&quot; 可将段落设为次要文本，常用于辅助说明。
      </Paragraph>
      <Paragraph strong>
        使用 strong 属性可以加粗整段文本，用于强调重要内容。
      </Paragraph>
      <Paragraph>
        段落中可嵌入 <Link href="#">链接</Link>，自动使用主题色和下划线样式。
      </Paragraph>
    </div>
  )
}
