import { Files } from "@/components/core/file-tree"

export default function FileTreeBasicExample() {
  return (
    <Files
      treeData={[
        { key: "src", title: "src", children: [
          { key: "app", title: "app.tsx" },
          { key: "index", title: "index.ts" },
        ]},
        { key: "package", title: "package.json" },
      ]}
      className="w-48"
    />
  )
}
