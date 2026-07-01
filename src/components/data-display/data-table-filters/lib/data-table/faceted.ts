import {
  getFacetedUniqueValues,
  type RowData,
  type Table,
} from "@tanstack/react-table";

export function getFacetedUniqueValuesFlattened<TData extends RowData>() {
  const base = getFacetedUniqueValues<TData>();

  return (table: Table<TData>, columnId: string) => {
    return () => {
      const values = base(table, columnId)();
      const flattened = new Map<string, number>();

      for (const [value, count] of values) {
        if (Array.isArray(value)) {
          for (const item of value) {
            flattened.set(item, (flattened.get(item) ?? 0) + count);
          }
        } else {
          flattened.set(value, (flattened.get(value) ?? 0) + count);
        }
      }

      return flattened;
    };
  };
}
