import { Popconfirm } from "@/components/ui/popconfirm"
import { Button } from "@/components/ui/button"
export default function Pc() {
  return <Popconfirm title="确定要删除吗？" onConfirm={() => {}}><Button size="small" color="danger" variant="outlined">删除</Button></Popconfirm>
}
