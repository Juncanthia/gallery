import { Item, ItemTitle, ItemDescription, ItemContent } from "@/components/core/list-item"

export default function ListItemBasicExample() {
  return (
    <div className="w-64 space-y-1 rounded border p-2">
      <Item>
        <ItemContent>
          <ItemTitle>列表项标题</ItemTitle>
          <ItemDescription>列表项描述信息</ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>另一条列表项</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  )
}
