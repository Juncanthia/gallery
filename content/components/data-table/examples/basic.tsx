import { TableProvider, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"

type User = { id: string; name: string; email: string; role: string }

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
]

const data: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "Editor" },
  { id: "3", name: "Carol", email: "carol@example.com", role: "Viewer" },
]

export default function DataTableBasicExample() {
  return (
    <TableProvider columns={columns} data={data}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableProvider>
  )
}
