import { Timeline } from "@/components/ui/timeline"

export default function TimelineBasicExample() {
  return (
    <Timeline
      items={[
        { label: "2015-09-01", children: "项目启动" },
        { label: "2015-09-02", children: "需求评审完成" },
        { label: "2015-09-03", children: "第一阶段开发上线" },
        { label: "2015-09-04", color: "gray", children: "等待第二阶段" },
      ]}
      className="max-w-sm"
    />
  )
}
