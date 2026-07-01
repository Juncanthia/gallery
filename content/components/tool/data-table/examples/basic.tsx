import { DataTable } from "@/components/agent-tools/data-table/data-table"

const columns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
    format: { kind: "currency" as const, currency: "USD" },
  },
  {
    key: "change",
    label: "Change",
    sortable: true,
    format: { kind: "delta" as const, decimals: 2 },
  },
  {
    key: "marketCap",
    label: "Market Cap",
    sortable: true,
    format: { kind: "number" as const, compact: true, unit: " USD" },
  },
  {
    key: "status",
    label: "Status",
    format: {
      kind: "status" as const,
      statusMap: {
        active: { tone: "success" as const, label: "Active" },
        pending: { tone: "warning" as const, label: "Pending" },
        inactive: { tone: "danger" as const, label: "Inactive" },
      },
    },
  },
  {
    key: "tags",
    label: "Tags",
    format: { kind: "badge" as const, colorMap: { crypto: "info" as const, defi: "success" as const, layer1: "warning" as const } },
  },
  {
    key: "website",
    label: "Website",
    format: { kind: "link" as const, external: true },
  },
]

const data = [
  {
    id: "1",
    name: "Bitcoin",
    price: 67890.5,
    change: 0.0342,
    marketCap: 1320000000000,
    status: "active",
    tags: "crypto",
    website: "bitcoin.org",
  },
  {
    id: "2",
    name: "Ethereum",
    price: 3456.78,
    change: -0.0215,
    marketCap: 416000000000,
    status: "active",
    tags: "defi",
    website: "ethereum.org",
  },
  {
    id: "3",
    name: "Solana",
    price: 178.9,
    change: 0.0891,
    marketCap: 82000000000,
    status: "active",
    tags: "layer1",
    website: "solana.com",
  },
  {
    id: "4",
    name: "Cardano",
    price: 0.456,
    change: -0.0032,
    marketCap: 16200000000,
    status: "pending",
    tags: "layer1",
    website: "cardano.org",
  },
  {
    id: "5",
    name: "Dogecoin",
    price: 0.124,
    change: 0.0015,
    marketCap: 18200000000,
    status: "inactive",
    tags: "crypto",
    website: "dogecoin.com",
  },
]

export default function Demo() {
  return (
    <DataTable
      id="data-table-demo"
      columns={columns}
      data={data}
      rowIdKey="id"
      defaultSort={{ by: "marketCap", direction: "desc" }}
      emptyMessage="No data available"
    />
  )
}
