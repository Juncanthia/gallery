"use client"

import { useState } from "react"
import { DataTableProvider } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-provider"
import { DataTableFloatingBar } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-floating-bar"
import { Button } from "@/components/core/button"
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
} from "@tanstack/react-table"
import type { DataTableFilterField } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-provider"
import { Trash2, Archive, Tags } from "lucide-react"

type Task = {
  id: string
  title: string
  blocks/status: string
  priority: string
  assignee: string
}

const data: Task[] = [
  { id: "1", title: "Fix login bug", blocks/status: "open", priority: "high", assignee: "Alice" },
  { id: "2", title: "Add dark mode", blocks/status: "in-progress", priority: "medium", assignee: "Bob" },
  { id: "3", title: "Update docs", blocks/status: "open", priority: "low", assignee: "Charlie" },
  { id: "4", title: "Refactor auth", blocks/status: "done", priority: "high", assignee: "Alice" },
  { id: "5", title: "Design new logo", blocks/status: "open", priority: "medium", assignee: "Diana" },
  { id: "6", title: "Write tests", blocks/status: "in-progress", priority: "high", assignee: "Bob" },
  { id: "7", title: "Deploy staging", blocks/status: "open", priority: "low", assignee: "Eve" },
  { id: "8", title: "Review PRs", blocks/status: "done", priority: "medium", assignee: "Charlie" },
]

const columns: ColumnDef<Task>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "blocks/status", header: "Status" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "assignee", header: "Assignee" },
]

const filterFields: DataTableFilterField<Task>[] = []

export default function Demo() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, rowSelection },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <DataTableProvider
      table={table}
      columns={columns}
      filterFields={filterFields}
      columnFilters={columnFilters}
    >
      <div className="w-full space-y-4">
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                    className="size-3.5 rounded border-border"
                  />
                </th>
                {table.getVisibleLeafColumns().map((column) => (
                  <th key={column.id} className="px-3 py-2 text-left font-medium">
                    {column.columnDef.header as string}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      onChange={row.getToggleSelectedHandler()}
                      className="size-3.5 rounded border-border"
                    />
                  </td>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2">
                      {cell.getValue() as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DataTableFloatingBar<Task>>
          {({ rows, table }) => (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  alert(`Archiving ${rows.length} task(s)`)
                  table.resetRowSelection()
                }}
              >
                <Archive className="mr-1.5 size-3.5" />
                Archive
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  alert(`Tagging ${rows.length} task(s)`)
                  table.resetRowSelection()
                }}
              >
                <Tags className="mr-1.5 size-3.5" />
                Tag
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  alert(`Deleting ${rows.length} task(s)`)
                  table.resetRowSelection()
                }}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Delete
              </Button>
            </>
          )}
        </DataTableFloatingBar>
      </div>
    </DataTableProvider>
  )
}
