import { List } from "@/components/ui/list"
import { Item, ItemContent, ItemTitle } from "@/components/ui/list-item"

export default function ListBasicExample() {
  return (
    <List className="w-full max-w-sm">
      <Item>
        <ItemContent>
          <ItemTitle>列表项 1</ItemTitle>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>列表项 2</ItemTitle>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>列表项 3</ItemTitle>
        </ItemContent>
      </Item>
    </List>
  )
}
