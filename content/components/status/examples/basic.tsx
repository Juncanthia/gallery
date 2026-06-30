import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"

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
    </div>
  )
}
