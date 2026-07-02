import { Text, Paragraph } from "@/components/core/typography"

export default function TypographyEllipsisExample() {
  return (
    <div className="max-w-xs space-y-6">
      <div>
        <Text ellipsis className="block w-full">
          单行溢出省略：这是一段很长的文本内容，超出容器宽度时自动截断并显示省略号。
        </Text>
      </div>
      <div>
        <Paragraph ellipsis={{ rows: 2, expandable: true }}>
          多行溢出省略示例。这是一段很长的文本内容，用于演示多行溢出时的省略效果。当文本超过指定的行数时，会自动截断并显示展开按钮。点击展开可以查看完整内容，点击收起可以恢复省略状态。
        </Paragraph>
      </div>
    </div>
  )
}
