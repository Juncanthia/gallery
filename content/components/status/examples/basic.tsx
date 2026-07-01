import { Status, StatusIndicator, StatusLabel } from "@/components/blocks/status"

export default function StatusBasicExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Status status="online">
        <StatusIndicator />
        <StatusLabel>运行中</StatusLabel>
      </Status>
      <Status status="offline">
        <StatusIndicator />
        <StatusLabel>已离线</StatusLabel>
      </Status>
      <Status status="maintenance">
        <StatusIndicator />
        <StatusLabel>维护中</StatusLabel>
      </Status>
      <Status status="degraded">
        <StatusIndicator />
        <StatusLabel>性能降级</StatusLabel>
      </Status>
      <Status status="success">
        <StatusIndicator />
        <StatusLabel>已完成</StatusLabel>
      </Status>
      <Status status="warning">
        <StatusIndicator />
        <StatusLabel>需关注</StatusLabel>
      </Status>
    </div>
  )
}
