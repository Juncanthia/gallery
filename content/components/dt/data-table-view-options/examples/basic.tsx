"use client"

import { useMemo, useState } from "react"
import { DataTableProvider } from "@/components/ui/dt-data-table-provider"
import { DataTableViewOptions } from "@/components/ui/dt-data-table-view-options"
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import type { DataTableFilterField } from "@/components/ui/dt-data-table-provider"

type Person = {
  id: string
  name: string
  email: string
  status: string
  role: string
  department: string
}

const data: Person[] = [
  { id: "1", name: "Alice", email: "alice@example.com", status: "active", role: "admin", department: "Engineering" },
  { id: "2", name: "Bob", email: "bob@example.com", status: "inactive", role: "user", department: "Design" },
  { id: "3", name: "Charlie", email: "charlie@example.com", status: "active", role: "editor", department: "Product" },
]

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name", meta: { label: "姓名" } },
  { accessorKey: "email", header: "Email", meta: { label: "邮箱" }, enableHiding: true },
  { accessorKey: "status", header: "Status", meta: { label: "状态" }, enableHiding: true },
  { accessorKey: "role", header: "Role", meta: { label: "角色" }, enableHiding: true },
  { accessorKey: "department", header: "Department", meta: { label: "部门" }, enableHiding: true },
]

const filterFields: DataTableFilterField<Person>[] = []

export default function Demo() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, columnVisibility },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  const visibleHeaders = useMemo(
    () => table.getVisibleLeafColumns().map((col) => col.id),
    [table.getState().columnVisibility],
  )

  return (
    <DataTableProvider
      table={table}
      columns={columns}
      filterFields={filterFields}
      columnFilters={columnFilters}
      enableColumnOrdering
    >
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            当前可见列：{visibleHeaders.length}/{columns.length} —{" "}
            {visibleHeaders.join("、") || "无"}
          </span>
          <DataTableViewOptions />
        </div>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
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
      </div>
    </DataTableProvider>
  )
}
