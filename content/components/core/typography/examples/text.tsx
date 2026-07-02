import { Text } from "@/components/core/typography"

export default function TypographyTextExample() {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Text>默认文本</Text>
        <Text type="secondary">次要文本</Text>
        <Text type="success">成功文本</Text>
        <Text type="warning">警告文本</Text>
        <Text type="danger">危险文本</Text>
        <Text disabled>禁用文本</Text>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Text underline>下划线</Text>
        <Text italic>斜体</Text>
        <Text delete>删除线</Text>
        <Text mark>高亮标记</Text>
        <Text code>code</Text>
        <Text keyboard>⌘K</Text>
        <Text strong>加粗</Text>
      </div>
    </div>
  )
}
