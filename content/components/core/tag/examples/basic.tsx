import { Tag } from "@/components/core/tag"

export default function TagBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tag>默认</Tag>
      <Tag color="primary">主要</Tag>
      <Tag color="success">成功</Tag>
      <Tag color="warning">警告</Tag>
      <Tag color="danger">危险</Tag>
      <Tag color="info">信息</Tag>
      <Tag closable onClose={() => {}}>可关闭</Tag>
    </div>
  )
}
