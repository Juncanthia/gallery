import { Transfer } from "@/components/core/transfer"
export default function Tf() {
  return <Transfer dataSource={[{ key: "1", title: "项目一" }, { key: "2", title: "项目二" }, { key: "3", title: "项目三" }]} targetKeys={[]} className="w-full max-w-md" />
}
