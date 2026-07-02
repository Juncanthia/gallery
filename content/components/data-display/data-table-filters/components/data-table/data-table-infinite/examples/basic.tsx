"use client"

import { useMemo, useState, useCallback } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTableInfinite } from "@/components/data-display/blocks/data-table-filters/components/blocks/data-table/blocks/data-table-infinite"
import { DataTableStoreProvider } from "@/components/data-display/blocks/data-table-filters/lib/store/provider/DataTableStoreProvider"
import { useMemoryAdapter } from "@/components/data-display/blocks/data-table-filters/lib/store/adapters/memory"
import { createSchema } from "@/components/data-display/blocks/data-table-filters/lib/store/schema"

type Record = {
  id: string
  name: string
  email: string
  blocks/status: "active" | "inactive" | "pending"
  role: string
}

const STATUS_MAP: Record<string, Record["blocks/status"]> = {
  "0": "active",
  "1": "inactive",
  "2": "pending",
}

const ROLES = ["Admin", "Editor", "Viewer", "Developer", "Manager"]

const allData: Record[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  blocks/status: STATUS_MAP[`${i % 3}`],
  role: ROLES[i % ROLES.length],
}))

const PAGE_SIZE = 10

const columns: ColumnDef<Record>[] = [
  { accessorKey: "id", header: "ID", size: 60 },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "blocks/status", header: "Status" },
  { accessorKey: "role", header: "Role" },
]

const schema = createSchema({})

export default function Demo() {
  const adapter = useMemoryAdapter(schema, { id: "demo-infinite" })

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const data = useMemo(() => allData.slice(0, page * PAGE_SIZE), [page])
  const hasNextPage = data.length < allData.length

  const fetchNextPage = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setPage((prev) => prev + 1)
    setLoading(false)
  }, [])

  const refetch = useCallback(() => {
    setPage(1)
  }, [])

  return (
    <DataTableStoreProvider adapter={adapter}>
      <div className="h-[500px] w-full max-w-4xl overflow-hidden rounded-md border">
        <DataTableInfinite
          columns={columns}
          data={data}
          totalRows={allData.length}
          filterRows={data.length}
          totalRowsFetched={data.length}
          isFetching={loading}
          isLoading={page === 1 && loading}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          refetch={refetch}
          tableId="demo-infinite"
        />
      </div>
    </DataTableStoreProvider>
  )
}
