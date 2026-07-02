import { Title } from "@/components/core/typography"

export default function TypographyTitleExample() {
  return (
    <div className="space-y-2">
      <Title level={1}>一级标题 H1</Title>
      <Title level={2}>二级标题 H2</Title>
      <Title level={3}>三级标题 H3</Title>
      <Title level={4}>四级标题 H4</Title>
      <Title level={5}>五级标题 H5</Title>
    </div>
  )
}
