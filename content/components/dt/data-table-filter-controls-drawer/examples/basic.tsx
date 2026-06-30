"use client"

import { useReactTable, getCoreRowModel, getFilteredRowModel } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableFilterControlsDrawer } from "@/components/ui/dt-data-table-filter-controls-drawer"
import { DataTableProvider } from "@hyper/data-table-filters"
import { DataTableStoreProvider } from "@hyper/data-table-filters/lib/store/provider/DataTableStoreProvider"
import { useMemoryAdapter } from "@hyper/data-table-filters/lib/store/adapters/memory"
import { createSchema, field } from "@hyper/data-table-filters/lib/store/schema"
import type { DataTableFilterField } from "@hyper/data-table-filters/components/data-table/types"

type Row = {
  id: string
  status: string
  priority: string
  latency: number
  host: string
}

const data: Row[] = [
  { id: "1", status: "success", priority: "high", latency: 45, host: "api.example.com" },
  { id: "2", status: "error", priority: "high", latency: 320, host: "db.example.com" },
  { id: "3", status: "pending", priority: "low", latency: 200, host: "cdn.example.com" },
  { id: "4", status: "success", priority: "medium", latency: 80, host: "api.example.com" },
  { id: "5", status: "error", priority: "low", latency: 500, host: "worker.example.com" },
]

const columns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "latency", header: "Latency (ms)" },
  { accessorKey: "host", header: "Host" },
]

const filterFields: DataTableFilterField<Row>[] = [
  {
    label: "Status",
    value: "status",
    type: "checkbox",
    defaultOpen: true,
    options: [
      { label: "Success", value: "success" },
      { label: "Error", value: "error" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    label: "Priority",
    value: "priority",
    type: "checkbox",
    options: [
      { label: "High", value: "high" },
      { label: "Medium", value: "medium" },
      { label: "Low", value: "low" },
    ],
  },
  {
    label: "Latency",
    value: "latency",
    type: "slider",
    min: 0,
    max: 600,
    unit: "ms",
  },
  {
    label: "Host",
    value: "host",
    type: "input",
    commandDisabled: true,
  },
]

const schema = createSchema({
  status: field.array(field.string()).default([]),
  priority: field.array(field.string()).default([]),
  latency: field.array(field.number()).delimiter("-"),
  host: field.string().default(""),
})

export default function Demo() {
  const adapter = useMemoryAdapter(schema, { id: "demo-filters" })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <DataTableStoreProvider adapter={adapter}>
      <DataTableProvider
        table={table}
        columns={columns}
        filterFields={filterFields}
      >
        <div className="flex items-center justify-center p-8">
          <DataTableFilterControlsDrawer />
        </div>
      </DataTableProvider>
    </DataTableStoreProvider>
  )
}
