import "@tanstack/react-table";
import type { Row, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // https://github.com/TanStack/table/issues/44#issuecomment-1377024296
  interface TableMeta<TData extends RowData> {
    getRowClassName?: (row: Row<TData>) => string;
  }

  // Generic slots are required for TanStack module augmentation parity.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TData/TValue anchor augmentation
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    label?: string;
    kind?: string;
  }
}
