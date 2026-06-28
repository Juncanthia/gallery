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
  ellipsis?: boolean
  hidden?: boolean
  className?: string
  headerClassName?: string
  onCell?: (record: T, index: number) => React.TdHTMLAttributes<HTMLTableCellElement>
  onHeaderCell?: (column: TableColumn<T>) => React.ThHTMLAttributes<HTMLTableCellElement>
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

type TableLocale = {
  emptyText?: React.ReactNode
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & Record<`data-${string}`, string | number | boolean | undefined>

type TableExpandable<T extends TableRecord = TableRecord> = {
  expandedRowRender?: (record: T, index: number, indent: number, expanded: boolean) => React.ReactNode
  rowExpandable?: (record: T) => boolean
  expandedRowKeys?: React.Key[]
  defaultExpandedRowKeys?: React.Key[]
  onExpand?: (expanded: boolean, record: T) => void
  onExpandedRowsChange?: (expandedKeys: React.Key[]) => void
  expandIcon?: (props: {
    expanded: boolean
    expandable: boolean
    record: T
    onExpand: (record: T) => void
  }) => React.ReactNode
  columnTitle?: React.ReactNode
  columnWidth?: number | string
}

type TableSorterResult<T extends TableRecord = TableRecord> = {
  column?: TableColumn<T>
  columnKey?: React.Key
  field?: TableColumn<T>["dataIndex"]
  order: TableSortOrder
}

type TableProps<T extends TableRecord = TableRecord> = Omit<
  React.ComponentProps<"table">,
  "children" | "onChange" | "title"
> & {
  columns?: TableColumn<T>[]
  dataSource?: T[]
  rowKey?: keyof T | ((record: T, index: number) => React.Key)
  loading?: boolean
  emptyText?: React.ReactNode
  locale?: TableLocale
  caption?: React.ReactNode
  title?: React.ReactNode | ((data: T[]) => React.ReactNode)
  footer?: React.ReactNode | ((data: T[]) => React.ReactNode)
  bordered?: boolean
  size?: TableSize
  showHeader?: boolean
  pagination?: false | TablePaginationConfig
  rowSelection?: TableRowSelection<T>
  rowClassName?: string | ((record: T, index: number) => string)
  onRow?: (record: T, index: number) => TableRowProps
  expandable?: TableExpandable<T>
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

function renderTableNode<T extends TableRecord>(
  node: React.ReactNode | ((data: T[]) => React.ReactNode) | undefined,
  data: T[]
) {
  return typeof node === "function" ? node(data) : node
}

function getRowClassName<T extends TableRecord>(
  rowClassName: TableProps<T>["rowClassName"],
  record: T,
  index: number
) {
  return typeof rowClassName === "function" ? rowClassName(record, index) : rowClassName
}

function Table<T extends TableRecord = TableRecord>({
  className,
  columns,
  dataSource,
  rowKey,
  loading,
  emptyText = "No data",
  locale,
  caption,
  title,
  footer,
  bordered,
  size = "default",
  showHeader = true,
  pagination,
  rowSelection,
  rowClassName,
  onRow,
  expandable,
  onChange,
  children,
  ...props
}: TableProps<T>) {
  const hasApiData = columns !== undefined
  const visibleColumns = React.useMemo(() => columns?.filter((column) => !column.hidden), [columns])
  const defaultSortColumn = visibleColumns?.find((column) => column.defaultSortOrder)
  const defaultSortColumnIndex = defaultSortColumn
    ? visibleColumns?.indexOf(defaultSortColumn) ?? -1
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
  const [innerExpandedRowKeys, setInnerExpandedRowKeys] = React.useState<React.Key[]>(
    expandable?.defaultExpandedRowKeys ?? []
  )
  const mergedSelectedRowKeys = rowSelection?.selectedRowKeys ?? innerSelectedRowKeys
  const mergedExpandedRowKeys = expandable?.expandedRowKeys ?? innerExpandedRowKeys
  const selectionEnabled = rowSelection !== undefined
  const expandableEnabled = expandable?.expandedRowRender !== undefined
  const normalizedData = React.useMemo(() => dataSource ?? [], [dataSource])

  const sortedData = React.useMemo(() => {
    if (!visibleColumns || !sortState.columnKey || !sortState.order) return normalizedData

    const column = visibleColumns.find((item, index) => getColumnKey(item, index) === sortState.columnKey)
    if (!column?.sorter) return normalizedData

    return [...normalizedData].sort((a, b) => {
      const result = typeof column.sorter === "function"
        ? column.sorter(a, b)
        : compareValue(getValue(a, column.dataIndex), getValue(b, column.dataIndex))

      return sortState.order === "ascend" ? result : -result
    })
  }, [normalizedData, sortState.columnKey, sortState.order, visibleColumns])

  const mergedPagination = getPaginationConfig(pagination, sortedData.length)
  const effectiveCurrent = paginationConfigProp?.current !== undefined
    ? paginationConfigProp.current
    : innerCurrent
  const pageSize = (mergedPagination?.pageSize ?? sortedData.length) || 1
  const pagedData = mergedPagination
    ? sortedData.slice((effectiveCurrent - 1) * pageSize, effectiveCurrent * pageSize)
    : sortedData
  const columnCount = Math.max((visibleColumns?.length ?? 1) + (selectionEnabled ? 1 : 0) + (expandableEnabled ? 1 : 0), 1)
  const titleNode = renderTableNode(title, sortedData)
  const footerNode = renderTableNode(footer, sortedData)

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

  const toggleExpanded = React.useCallback((record: T, index: number) => {
    const key = getRecordKey(record, index, rowKey)
    const expanded = !mergedExpandedRowKeys.map(String).includes(String(key))
    const nextKeys = expanded
      ? [...mergedExpandedRowKeys, key]
      : mergedExpandedRowKeys.filter((item) => String(item) !== String(key))

    if (expandable?.expandedRowKeys === undefined) {
      setInnerExpandedRowKeys(nextKeys)
    }

    expandable?.onExpand?.(expanded, record)
    expandable?.onExpandedRowsChange?.(nextKeys)
  }, [expandable, mergedExpandedRowKeys, rowKey])

  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto",
        bordered && "rounded-md border"
      )}
    >
      {titleNode ? (
        <div data-slot="table-title" className={cn("border-b p-3 text-sm font-medium", !bordered && "rounded-t border")}>
          {titleNode}
        </div>
      ) : null}
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {caption && <TableCaption>{caption}</TableCaption>}
        {hasApiData ? (
          <>
            {showHeader ? (
              <TableHeader>
                <TableRow>
                  {expandableEnabled && (
                    <TableHead
                      className={cn(
                        getHeadSizeClassName(size),
                        "w-10",
                        bordered && "border-r"
                      )}
                      style={{ width: expandable?.columnWidth }}
                    >
                      {expandable?.columnTitle}
                    </TableHead>
                  )}
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
                  {visibleColumns?.map((column, index) => {
                    const columnKey = getColumnKey(column, index)
                    const sortOrder = sortState.columnKey === columnKey ? sortState.order : null
                    const headerCellProps = column.onHeaderCell?.(column)

                    return (
                      <TableHead
                        key={columnKey}
                        {...headerCellProps}
                        className={cn(
                          getHeadSizeClassName(size),
                          getAlignClassName(column.align),
                          bordered && "border-r last:border-r-0",
                          headerCellProps?.className,
                          column.headerClassName
                        )}
                        style={{ width: column.width, ...headerCellProps?.style }}
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
            ) : null}
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {expandableEnabled && (
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
                    {visibleColumns?.map((column, colIndex) => (
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
                pagedData.map((record, rowIndex) => {
                  const recordKey = getRecordKey(record, rowIndex, rowKey)
                  const expanded = mergedExpandedRowKeys.map(String).includes(String(recordKey))
                  const canExpand = expandableEnabled && (expandable?.rowExpandable?.(record) ?? true)
                  const rowProps = onRow?.(record, rowIndex)

                  return (
                    <React.Fragment key={recordKey}>
                      <TableRow
                        {...rowProps}
                        data-state={mergedSelectedRowKeys.map(String).includes(String(recordKey)) ? "selected" : undefined}
                        className={cn(rowProps?.className, getRowClassName(rowClassName, record, rowIndex))}
                      >
                        {expandableEnabled && (
                          <TableCell
                            className={cn(
                              getCellSizeClassName(size),
                              "w-10",
                              bordered && "border-r"
                            )}
                          >
                            {expandable?.expandIcon ? (
                              expandable.expandIcon({
                                expanded,
                                expandable: canExpand,
                                record,
                                onExpand: (nextRecord) => toggleExpanded(nextRecord, rowIndex),
                              })
                            ) : canExpand ? (
                              <button
                                type="button"
                                className="inline-flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                aria-label={expanded ? "Collapse row" : "Expand row"}
                                onClick={() => toggleExpanded(record, rowIndex)}
                              >
                                <span className={cn("text-xs transition-transform", expanded && "rotate-90")}>▶</span>
                              </button>
                            ) : null}
                          </TableCell>
                        )}
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
                              checked={mergedSelectedRowKeys.map(String).includes(String(recordKey))}
                              disabled={rowSelection?.getCheckboxProps?.(record).disabled}
                              title={rowSelection?.getCheckboxProps?.(record).title}
                              onChange={(checked) => {
                                const selectedSet = new Set(mergedSelectedRowKeys)

                                if (checked) {
                                  selectedSet.add(recordKey)
                                } else {
                                  selectedSet.delete(recordKey)
                                }

                                updateSelection(Array.from(selectedSet))
                              }}
                            />
                          </TableCell>
                        )}
                        {visibleColumns?.map((column, colIndex) => {
                          const value = getValue(record, column.dataIndex)
                          const cellProps = column.onCell?.(record, rowIndex)

                          return (
                            <TableCell
                              key={getColumnKey(column, colIndex)}
                              {...cellProps}
                              className={cn(
                                getCellSizeClassName(size),
                                getAlignClassName(column.align),
                                column.ellipsis && "max-w-0 truncate",
                                bordered && "border-r last:border-r-0",
                                cellProps?.className,
                                column.className
                              )}
                              style={{ width: column.width, ...cellProps?.style }}
                            >
                              {column.render ? column.render(value, record, rowIndex) : String(value ?? "")}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      {expanded && expandable?.expandedRowRender ? (
                        <TableRow data-slot="table-expanded-row">
                          <TableCell className={cn(getCellSizeClassName(size), "bg-muted/30 text-muted-foreground")} colSpan={columnCount}>
                            {expandable.expandedRowRender(record, rowIndex, 0, expanded)}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </React.Fragment>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center text-muted-foreground" colSpan={columnCount}>
                    {locale?.emptyText ?? emptyText}
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
              column: visibleColumns?.find((column, index) => getColumnKey(column, index) === sortState.columnKey),
              columnKey: sortState.columnKey,
              field: visibleColumns?.find((column, index) => getColumnKey(column, index) === sortState.columnKey)?.dataIndex,
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
      {footerNode ? (
        <div data-slot="table-footer" className={cn("border-t p-3 text-sm text-muted-foreground", !bordered && "rounded-b border")}>
          {footerNode}
        </div>
      ) : null}
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
export type { TableAlign, TableColumn, TableExpandable, TableLocale, TablePaginationConfig, TableProps, TableRecord, TableRowProps, TableRowSelection, TableSize, TableSorterResult, TableSortOrder }
