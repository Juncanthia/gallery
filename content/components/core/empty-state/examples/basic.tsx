import { Empty, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/core/empty-state"
import { Button } from "@/components/core/button"

export default function EmptyStateBasicExample() {
  return (
    <Empty
      description="当前列表为空，创建第一条记录开始使用。"
      actions={<Button size="small" color="primary" variant="solid">立即创建</Button>}
    >
      <EmptyTitle>暂无数据</EmptyTitle>
    </Empty>
  )
}
