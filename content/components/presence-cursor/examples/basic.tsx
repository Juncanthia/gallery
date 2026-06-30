import {
  Cursor,
  CursorPointer,
  CursorBody,
  CursorName,
  CursorMessage,
} from "@/components/ui/presence-cursor"

const users = [
  { id: "1", name: "Alice", color: "text-blue-500", x: 20, y: 30 },
  { id: "2", name: "Bob", color: "text-red-500", x: 120, y: 70 },
]

export default function CursorBasicExample() {
  return (
    <div className="relative h-32 w-full rounded border bg-muted/20">
      {users.map((u) => (
        <Cursor key={u.id} className="absolute" style={{ top: u.y, left: u.x }}>
          <CursorPointer className={u.color} />
          <CursorBody>
            <CursorName>{u.name}</CursorName>
            <CursorMessage>
              {u.id === "1" ? "编辑中" : "查看中"}
            </CursorMessage>
          </CursorBody>
        </Cursor>
      ))}
    </div>
  )
}
