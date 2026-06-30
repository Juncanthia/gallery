"use client"

import { useState } from "react"
import { DataTableProvider } from "@/components/ui/dt-data-table-provider"
import { DataTableFilterCheckbox } from "@/components/ui/dt-data-table-filter-checkbox"
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
  status: string
  role: string
}

const data: Person[] = [
  { id: "1", name: "Alice", status: "active", role: "admin" },
  { id: "2", name: "Bob", status: "inactive", role: "user" },
  { id: "3", name: "Charlie", status: "active", role: "editor" },
  { id: "4", name: "Diana", status: "pending", role: "user" },
  { id: "5", name: "Eve", status: "active", role: "admin" },
]

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "role", header: "Role" },
]

const filterFields: DataTableFilterField<Person>[] = [
  {
    label: "Status",
    value: "status",
    type: "checkbox",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
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

  const getFacetedUniqueValues = (
    table: ReturnType<typeof useReactTable<Person>>,
    columnId: string,
  ): Map<string, number> => {
    const map = new Map<string, number>()
    table.getPreFilteredRowModel().rows.forEach((row) => {
      const value = row.getValue(columnId) as string
      map.set(value, (map.get(value) || 0) + 1)
    })
    return map
  }

  return (
    <DataTableProvider
      table={table}
      columns={columns}
      filterFields={filterFields}
      columnFilters={columnFilters}
      getFacetedUniqueValues={getFacetedUniqueValues}
    >
      <div className="w-full max-w-xs">
        <DataTableFilterCheckbox<Person>
          label="Status"
          value="status"
          type="checkbox"
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Pending", value: "pending" },
          ]}
        />
      </div>
    </DataTableProvider>
  )
}
