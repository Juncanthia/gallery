import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/core/table"
import { Badge } from "@/components/core/badge"

const data = [
  { id: "1", name: "张三", email: "zhang@example.com", role: "管理员", blocks/status: "活跃" },
  { id: "2", name: "李四", email: "li@example.com", role: "编辑", blocks/status: "活跃" },
  { id: "3", name: "王五", email: "wang@example.com", role: "访客", blocks/status: "禁用" },
  { id: "4", name: "赵六", email: "zhao@example.com", role: "编辑", blocks/status: "活跃" },
]

export default function TableStatesExample() {
  return (
    <Table className="w-full max-w-lg">
      <TableCaption>用户列表 · 共 {data.length} 条</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">姓名</TableHead>
          <TableHead>邮箱</TableHead>
          <TableHead>角色</TableHead>
          <TableHead className="text-right">状态</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell className="text-muted-foreground">{row.email}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell className="text-right">
              <Badge variant={row.blocks/status === "活跃" ? "default" : "secondary"}>
                {row.blocks/status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
