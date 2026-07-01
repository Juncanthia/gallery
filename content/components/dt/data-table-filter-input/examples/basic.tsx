"use client"

import { useState } from "react"
import { DataTableProvider } from "@/components/ui/dt-data-table-provider"
import { DataTableFilterInput } from "@/components/ui/dt-data-table-filter-input"
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import type { DataTableFilterField } from "@/components/data-display/data-table-filters"

type Person = {
  id: string
  name: string
  email: string
}

const data: Person[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@test.com" },
  { id: "3", name: "Charlie", email: "charlie@example.com" },
]

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
]

const filterFields: DataTableFilterField<Person>[] = [
  {
    label: "Name",
    value: "name",
    type: "input",
  },
]

export default function Demo() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
      <div className="w-full max-w-sm">
        <DataTableFilterInput<Person>
          label="Name"
          value="name"
          type="input"
        />
      </div>
    </DataTableProvider>
  )
}
