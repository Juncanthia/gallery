import { Text, Title } from "@/components/ui/typography"

export default function TypographyCopyableExample() {
  return (
    <div className="space-y-4">
      <div>
        <Text copyable>点击右侧图标复制这段文本</Text>
      </div>
      <div>
        <Title level={3} copyable>
          可复制的标题
        </Title>
      </div>
    </div>
  )
}
