import { useState } from "react"
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
} from "@/components/ui/kanban"

const columns = [
  { id: "todo", name: "To Do" },
  { id: "in-progress", name: "In Progress" },
  { id: "review", name: "Review" },
  { id: "done", name: "Done" },
]

const initialData = [
  { id: "1", name: "Design system audit", column: "todo" },
  { id: "2", name: "API endpoint refactor", column: "in-progress" },
  { id: "3", name: "Unit test coverage", column: "in-progress" },
  { id: "4", name: "Pull request review", column: "review" },
  { id: "5", name: "Update changelog", column: "done" },
  { id: "6", name: "Release v2.1.0", column: "done" },
]

export default function KanbanBasicExample() {
  const [data, setData] = useState(initialData)

  return (
    <KanbanProvider columns={columns} data={data} onDataChange={setData}>
      {(column) => (
        <KanbanBoard key={column.id} id={column.id}>
          <KanbanHeader>{column.name}</KanbanHeader>
          <KanbanCards id={column.id}>
            {(item) => <KanbanCard key={item.id} {...item} />}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  )
}
