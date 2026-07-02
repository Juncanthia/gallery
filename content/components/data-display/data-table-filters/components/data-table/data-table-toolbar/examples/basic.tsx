"use client"

import { useReactTable, getCoreRowModel, getFilteredRowModel } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableToolbar } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-toolbar"
import { DataTableProvider } from "@/components/data-display/blocks/data-table-filters"
import { DataTableStoreProvider } from "@/components/data-display/blocks/data-table-filters/lib/store/provider/DataTableStoreProvider"
import { useMemoryAdapter } from "@/components/data-display/blocks/data-table-filters/lib/store/adapters/memory"
import { createSchema, field } from "@/components/data-display/blocks/data-table-filters/lib/store/schema"
import type { DataTableFilterField } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/types"

type Row = {
  id: string
  name: string
  category: string
  price: number
}

const data: Row[] = [
  { id: "1", name: "Alpha", category: "Electronics", price: 120 },
  { id: "2", name: "Beta", category: "Clothing", price: 45 },
  { id: "3", name: "Gamma", category: "Electronics", price: 250 },
  { id: "4", name: "Delta", category: "Books", price: 18 },
  { id: "5", name: "Epsilon", category: "Clothing", price: 90 },
]

const columns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "名称" },
  { accessorKey: "category", header: "分类" },
  { accessorKey: "price", header: "价格" },
]

const filterFields: DataTableFilterField<Row>[] = [
  {
    label: "分类",
    value: "category",
    type: "checkbox",
    defaultOpen: true,
    options: [
      { label: "Electronics", value: "Electronics" },
      { label: "Clothing", value: "Clothing" },
      { label: "Books", value: "Books" },
    ],
  },
  {
    label: "价格",
    value: "price",
    type: "slider",
    min: 0,
    max: 300,
    unit: "元",
  },
  {
    label: "名称",
    value: "name",
    type: "input",
    commandDisabled: true,
  },
]

const schema = createSchema({
  category: field.array(field.string()).default([]),
  price: field.array(field.number()).delimiter("-"),
  name: field.string().default(""),
})

export default function Demo() {
  const adapter = useMemoryAdapter(schema, { id: "demo-toolbar" })

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
        <div className="w-full">
          <DataTableToolbar />
          <div className="mt-4 border rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-2 text-left font-medium">
                        {header.column.columnDef.header as string}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
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
    </DataTableStoreProvider>
  )
}
