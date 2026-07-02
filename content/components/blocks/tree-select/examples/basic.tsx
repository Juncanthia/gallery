import { TreeSelect } from "@/components/core/tree-select"
export default function Ts() {
  return <TreeSelect treeData={[{ key: "1", title: "根节点", children: [{ key: "1-1", title: "子节点" }] }]} placeholder="请选择" className="w-48" />
}
