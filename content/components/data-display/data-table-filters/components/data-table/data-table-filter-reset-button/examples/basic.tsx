"use client"

import { useState } from "react"
import { DataTableProvider } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-provider"
import { DataTableFilterResetButton } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-filter-reset-button"
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import type { DataTableFilterField } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/types"

type Person = {
  id: string
  name: string
  blocks/status: string
}

const data: Person[] = [
  { id: "1", name: "Alice", blocks/status: "active" },
  { id: "2", name: "Bob", blocks/status: "inactive" },
  { id: "3", name: "Charlie", blocks/status: "active" },
]

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "blocks/status", header: "Status" },
]

const filterFields: DataTableFilterField<Person>[] = [
  {
    label: "Status",
    value: "blocks/status",
    type: "checkbox",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
]

export default function Demo() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "blocks/status", value: ["active"] },
  ])

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTableProvider
      table={table}
      columns={columns}
      filterFields={filterFields}
      columnFilters={columnFilters}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status 筛选：</span>
        <DataTableFilterResetButton<Person>
          value="blocks/status"
          label="Status"
          type="checkbox"
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
        <span className="text-sm text-muted-foreground">（点击 X 可清除筛选）</span>
      </div>
    </DataTableProvider>
  )
}
