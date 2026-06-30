import { Mentions } from "@/components/ui/mentions"
export default function Mn() { return <Mentions options={[{ label: "张三", value: "zhangsan" }, { label: "李四", value: "lisi" }]} placeholder="输入 @ 提及用户" className="w-64" /> }
