import * as React from "react"

import { Checkbox } from "@/components/base/checkbox"
import { Pagination, type PaginationProps } from "@/components/base/pagination"
import { cn } from "@/lib/utils"

type TableRecord = Record<string, unknown>
type TableSize = "small" | "default" | "large"
type TableAlign = "left" | "center" | "right"
type TableSortOrder = "ascend" | "descend" | null

type TableColumn<T extends TableRecord = TableRecord> = {
  key?: React.Key
  title?: React.ReactNode
  dataIndex?: keyof T | string | readonly (string | number)[]
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  align?: TableAlign
  width?: number | string
  className?: string
  headerClassName?: string
  sorter?: boolean | ((a: T, b: T) => number)
  defaultSortOrder?: TableSortOrder
}

type TablePaginationConfig = Pick<
  PaginationProps,
  | "current"
  | "defaultCurrent"
  | "defaultPageSize"
  | "hideOnSinglePage"
  | "pageSize"
  | "showLessItems"
  | "showTotal"
  | "simple"
> & {
  onChange?: (page: number, pageSize: number) => void
}

type TableRowSelection<T extends TableRecord = TableRecord> = {
  selectedRowKeys?: React.Key[]
  defaultSelectedRowKeys?: React.Key[]
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
  getCheckboxProps?: (record: T) => { disabled?: boolean; title?: string }
}

type TableSorterResult<T extends TableRecord = TableRecord> = {
  column?: TableColumn<T>
  columnKey?: React.Key
  field?: TableColumn<T>["dataIndex"]
  order: TableSortOrder
}

type TableProps<T extends TableRecord = TableRecord> = Omit<
  React.ComponentProps<"table">,
  "children" | "onChange"
> & {
  columns?: TableColumn<T>[]
  dataSource?: T[]
  rowKey?: keyof T | ((record: T, index: number) => React.Key)
  loading?: boolean
  emptyText?: React.ReactNode
  caption?: React.ReactNode
  bordered?: boolean
  size?: TableSize
  pagination?: false | TablePaginationConfig
  rowSelection?: TableRowSelection<T>
  onChange?: (
    pagination: { current: number; pageSize: number; total: number },
    filters: Record<string, unknown>,
    sorter: TableSorterResult<T>,
    extra: { currentDataSource: T[] }
  ) => void
  children?: React.ReactNode
}

function getValue<T extends TableRecord>(
  record: T,
  dataIndex: TableColumn<T>["dataIndex"]
) {
  if (dataIndex === undefined) return undefined
  const path = Array.isArray(dataIndex) ? dataIndex : String(dataIndex).split(".")

  return path.reduce<unknown>((value, key) => {
    if (value && typeof value === "object") {
      return (value as Record<string | number, unknown>)[key]
    }
    return undefined
  }, record)
}

function getRecordKey<T extends TableRecord>(
  record: T,
  index: number,
  rowKey?: TableProps<T>["rowKey"]
) {
  if (typeof rowKey === "function") return rowKey(record, index)
  if (rowKey) return String(record[rowKey])
  if ("key" in record && record.key !== undefined) return String(record.key)
  return index
}

function getColumnKey<T extends TableRecord>(column: TableColumn<T>, index: number) {
  return column.key ?? String(column.dataIndex ?? index)
}

function compareValue(a: unknown, b: unknown) {
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true })
}

function getNextSortOrder(current: TableSortOrder) {
  if (current === null) return "ascend"
  if (current === "ascend") return "descend"
  return null
}

function getPaginationConfig(
  pagination: false | TablePaginationConfig | undefined,
  total: number
) {
  if (pagination === false) return null

  const pageSize = Math.max(1, pagination?.pageSize ?? pagination?.defaultPageSize ?? 10)
  const current = Math.max(1, pagination?.current ?? pagination?.defaultCurrent ?? 1)

  return { current, pageSize, total }
}

function getAlignClassName(align?: TableAlign) {
  if (align === "center") return "text-center"
  if (align === "right") return "text-right"
  return undefined
}

function getCellSizeClassName(size: TableSize) {
  if (size === "small") return "px-2 py-1.5"
  if (size === "large") return "px-3 py-3"
  return "p-2"
}

function getHeadSizeClassName(size: TableSize) {
  if (size === "small") return "h-8 px-2"
  if (size === "large") return "h-12 px-3"
  return "h-10 px-2"
}

function Table<T extends TableRecord = TableRecord>({
  className,
  columns,
  dataSource,
  rowKey,
  loading,
  emptyText = "No data",
  caption,
  bordered,
  size = "default",
  pagination,
  rowSelection,
  onChange,
  children,
  ...props
}: TableProps<T>) {
  const hasApiData = columns !== undefined
  const defaultSortColumn = columns?.find((column) => column.defaultSortOrder)
  const defaultSortColumnIndex = defaultSortColumn
    ? columns?.indexOf(defaultSortColumn) ?? -1
    : -1
  const [sortState, setSortState] = React.useState<{
    columnKey?: React.Key
    order: TableSortOrder
  }>({
    columnKey: defaultSortColumn
      ? getColumnKey(defaultSortColumn, defaultSortColumnIndex)
      : undefined,
    order: defaultSortColumn?.defaultSortOrder ?? null,
  })
  const paginationConfigProp = pagination === false ? undefined : pagination
  const [innerCurrent, setInnerCurrent] = React.useState(
    paginationConfigProp?.defaultCurrent ?? 1
  )
  const [innerSelectedRowKeys, setInnerSelectedRowKeys] = React.useState<React.Key[]>(
    rowSelection?.defaultSelectedRowKeys ?? []
  )
  const mergedSelectedRowKeys = rowSelection?.selectedRowKeys ?? innerSelectedRowKeys
  const selectionEnabled = rowSelection !== undefined
  const normalizedData = React.useMemo(() => dataSource ?? [], [dataSource])

  const sortedData = React.useMemo(() => {
    if (!columns || !sortState.columnKey || !sortState.order) return normalizedData

    const column = columns.find((item, index) => getColumnKey(item, index) === sortState.columnKey)
    if (!column?.sorter) return normalizedData

    return [...normalizedData].sort((a, b) => {
      const result = typeof column.sorter === "function"
        ? column.sorter(a, b)
        : compareValue(getValue(a, column.dataIndex), getValue(b, column.dataIndex))

      return sortState.order === "ascend" ? result : -result
    })
  }, [columns, normalizedData, sortState.columnKey, sortState.order])

  const mergedPagination = getPaginationConfig(pagination, sortedData.length)
  const effectiveCurrent = paginationConfigProp?.current !== undefined
    ? paginationConfigProp.current
    : innerCurrent
  const pageSize = (mergedPagination?.pageSize ?? sortedData.length) || 1
  const pagedData = mergedPagination
    ? sortedData.slice((effectiveCurrent - 1) * pageSize, effectiveCurrent * pageSize)
    : sortedData
  const columnCount = Math.max((columns?.length ?? 1) + (selectionEnabled ? 1 : 0), 1)

  const getSelectedRows = React.useCallback(
    (selectedKeys: React.Key[]) => {
      const selectedKeySet = new Set(selectedKeys.map(String))
      return normalizedData.filter((record, index) =>
        selectedKeySet.has(String(getRecordKey(record, index, rowKey)))
      )
    },
    [normalizedData, rowKey]
  )

  const updateSelection = React.useCallback(
    (nextKeys: React.Key[]) => {
      if (rowSelection?.selectedRowKeys === undefined) {
        setInnerSelectedRowKeys(nextKeys)
      }
      rowSelection?.onChange?.(nextKeys, getSelectedRows(nextKeys))
    },
    [getSelectedRows, rowSelection]
  )

  const triggerChange = React.useCallback(
    (nextCurrent: number, nextSorter: TableSorterResult<T>) => {
      onChange?.(
        {
          current: nextCurrent,
          pageSize,
          total: sortedData.length,
        },
        {},
        nextSorter,
        { currentDataSource: sortedData }
      )
    },
    [onChange, pageSize, sortedData]
  )

  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto",
        bordered && "rounded-md border"
      )}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {caption && <TableCaption>{caption}</TableCaption>}
        {hasApiData ? (
          <>
            <TableHeader>
              <TableRow>
                {selectionEnabled && (
                  <TableHead
                    className={cn(
                      getHeadSizeClassName(size),
                      "w-10",
                      bordered && "border-r"
                    )}
                  >
                    <Checkbox
                      aria-label="Select all rows"
                      checked={
                        pagedData.length > 0 &&
                        pagedData.every((record, index) =>
                          mergedSelectedRowKeys.map(String).includes(
                            String(getRecordKey(record, index, rowKey))
                          )
                        )
                      }
                      indeterminate={
                        pagedData.some((record, index) =>
                          mergedSelectedRowKeys.map(String).includes(
                            String(getRecordKey(record, index, rowKey))
                          )
                        ) &&
                        !pagedData.every((record, index) =>
                          mergedSelectedRowKeys.map(String).includes(
                            String(getRecordKey(record, index, rowKey))
                          )
                        )
                      }
                      onChange={(checked) => {
                        const pageKeys = pagedData.map((record, index) =>
                          getRecordKey(record, index, rowKey)
                        )
                        const selectedSet = new Set(mergedSelectedRowKeys)

                        if (checked) {
                          pageKeys.forEach((key) => selectedSet.add(key))
                        } else {
                          pageKeys.forEach((key) => selectedSet.delete(key))
                        }

                        updateSelection(Array.from(selectedSet))
                      }}
                    />
                  </TableHead>
                )}
                {columns.map((column, index) => {
                  const columnKey = getColumnKey(column, index)
                  const sortOrder = sortState.columnKey === columnKey ? sortState.order : null

                  return (
                    <TableHead
                      key={columnKey}
                      className={cn(
                        getHeadSizeClassName(size),
                        getAlignClassName(column.align),
                        bordered && "border-r last:border-r-0",
                        column.headerClassName
                      )}
                      style={{ width: column.width }}
                    >
                      {column.sorter ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-left hover:text-foreground"
                          onClick={() => {
                            const order = getNextSortOrder(sortOrder)
                            setSortState({ columnKey, order })
                            triggerChange(effectiveCurrent, {
                              column,
                              columnKey,
                              field: column.dataIndex,
                              order,
                            })
                          }}
                        >
                          <span>{column.title}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {sortOrder === "ascend" ? "▲" : sortOrder === "descend" ? "▼" : "↕"}
                          </span>
                        </button>
                      ) : (
                        column.title
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {selectionEnabled && (
                      <TableCell
                        className={cn(
                          getCellSizeClassName(size),
                          "w-10",
                          bordered && "border-r"
                        )}
                      >
                        <div className="h-3 w-3 animate-pulse rounded bg-muted" />
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={getColumnKey(column, colIndex)}
                        className={cn(
                          getCellSizeClassName(size),
                          bordered && "border-r last:border-r-0",
                          column.className
                        )}
                      >
                        <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : pagedData.length ? (
                pagedData.map((record, rowIndex) => (
                  <TableRow key={getRecordKey(record, rowIndex, rowKey)}>
                    {selectionEnabled && (
                      <TableCell
                        className={cn(
                          getCellSizeClassName(size),
                          "w-10",
                          bordered && "border-r"
                        )}
                      >
                        <Checkbox
                          aria-label="Select row"
                          checked={mergedSelectedRowKeys.map(String).includes(
                            String(getRecordKey(record, rowIndex, rowKey))
                          )}
                          disabled={rowSelection?.getCheckboxProps?.(record).disabled}
                          title={rowSelection?.getCheckboxProps?.(record).title}
                          onChange={(checked) => {
                            const key = getRecordKey(record, rowIndex, rowKey)
                            const selectedSet = new Set(mergedSelectedRowKeys)

                            if (checked) {
                              selectedSet.add(key)
                            } else {
                              selectedSet.delete(key)
                            }

                            updateSelection(Array.from(selectedSet))
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => {
                      const value = getValue(record, column.dataIndex)

                      return (
                        <TableCell
                          key={getColumnKey(column, colIndex)}
                          className={cn(
                            getCellSizeClassName(size),
                            getAlignClassName(column.align),
                            bordered && "border-r last:border-r-0",
                            column.className
                          )}
                        >
                          {column.render ? column.render(value, record, rowIndex) : String(value ?? "")}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center text-muted-foreground" colSpan={columnCount}>
                    {emptyText}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </>
        ) : (
          children
        )}
      </table>
      {hasApiData && mergedPagination && (
        <Pagination
          className="mt-3 justify-end"
          current={effectiveCurrent}
          hideOnSinglePage={paginationConfigProp?.hideOnSinglePage}
          onChange={(page, nextPageSize) => {
            if (!paginationConfigProp || paginationConfigProp.current === undefined) {
              setInnerCurrent(page)
            }
            paginationConfigProp?.onChange?.(page, nextPageSize)
            triggerChange(page, {
              column: columns?.find((column, index) => getColumnKey(column, index) === sortState.columnKey),
              columnKey: sortState.columnKey,
              field: columns?.find((column, index) => getColumnKey(column, index) === sortState.columnKey)?.dataIndex,
              order: sortState.order,
            })
          }}
          pageSize={pageSize}
          showLessItems={paginationConfigProp?.showLessItems}
          showTotal={paginationConfigProp?.showTotal}
          simple={paginationConfigProp?.simple}
          size={size === "small" ? "small" : "middle"}
          total={sortedData.length}
        />
      )}
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
export type { TableAlign, TableColumn, TablePaginationConfig, TableProps, TableRecord, TableRowSelection, TableSize, TableSorterResult, TableSortOrder }
