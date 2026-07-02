import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/core/table"

const data = [
  { id: "1", name: "张三", department: "技术部", blocks/status: "在职" },
  { id: "2", name: "李四", department: "产品部", blocks/status: "在职" },
  { id: "3", name: "王五", department: "设计部", blocks/status: "休假" },
]

export default function TableBasicExample() {
  return (
    <Table className="w-full max-w-md">
      <TableCaption>员工列表</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>姓名</TableHead>
          <TableHead>部门</TableHead>
          <TableHead>状态</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.blocks/status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
