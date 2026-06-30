import { Tree } from "@/components/ui/tree"
export default function Tr() {
  return (
    <Tree
      treeData={[
        { key: "1", title: "根节点", children: [
          { key: "1-1", title: "子节点 1" },
          { key: "1-2", title: "子节点 2", children: [{ key: "1-2-1", title: "孙子节点" }] },
        ]},
      ]}
      className="w-48"
    />
  )
}
