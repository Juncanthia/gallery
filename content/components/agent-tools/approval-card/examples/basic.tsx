"use client"

import { ApprovalCard } from "@/components/agent-tools/approval-card/approval-card"

export default function Demo() {
  return (
    <ApprovalCard
      id="approval-demo"
      title="审批请假申请"
      description="张三申请 2025-07-03 至 2025-07-05 年假，共 3 天。"
      icon="calendar"
      metadata={[
        { key: "申请人", value: "张三" },
        { key: "部门", value: "技术部" },
        { key: "请假类型", value: "年假" },
        { key: "开始日期", value: "2025-07-03" },
        { key: "结束日期", value: "2025-07-05" },
      ]}
      confirmLabel="通过"
      cancelLabel="驳回"
      onConfirm={() => console.log("已通过")}
      onCancel={() => console.log("已驳回")}
    />
  )
}
