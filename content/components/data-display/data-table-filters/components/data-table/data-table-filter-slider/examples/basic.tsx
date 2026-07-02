"use client"

import { useMemo, useState } from "react"
import { DataTableProvider } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-provider"
import { DataTableFilterSlider } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-filter-slider"
import {
  useReactTable,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import type { DataTableFilterField } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-provider"

type Product = {
  id: string
  name: string
  price: number
}

const data: Product[] = [
  { id: "1", name: "产品 A", price: 99 },
  { id: "2", name: "产品 B", price: 199 },
  { id: "3", name: "产品 C", price: 299 },
  { id: "4", name: "产品 D", price: 399 },
  { id: "5", name: "产品 E", price: 499 },
]

const columns: ColumnDef<Product>[] = [
  { accessorKey: "name", header: "名称" },
  { accessorKey: "price", header: "价格" },
]

const filterFields: DataTableFilterField<Product>[] = [
  {
    label: "价格",
    value: "price",
    type: "slider",
    min: 0,
    max: 600,
    unit: "¥",
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
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  return (
    <DataTableProvider
      table={table}
      columns={columns}
      filterFields={filterFields}
      columnFilters={columnFilters}
    >
      <DataTableFilterSlider<Product>
        label="价格"
        value="price"
        type="slider"
        min={0}
        max={600}
        unit="¥"
      />
    </DataTableProvider>
  )
}
