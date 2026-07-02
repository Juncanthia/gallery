import { Descriptions, DescriptionsItem } from "@/components/core/descriptions"
export default function Desc() {
  return (
    <Descriptions className="w-full max-w-sm" bordered>
      <DescriptionsItem label="姓名">张三</DescriptionsItem>
      <DescriptionsItem label="部门">技术部</DescriptionsItem>
      <DescriptionsItem label="状态">在职</DescriptionsItem>
    </Descriptions>
  )
}
