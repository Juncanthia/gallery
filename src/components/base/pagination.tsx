import * as React from "react"

import { Button } from "@/components/base/button"
import { cn } from "@/lib/utils"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  MoveHorizontal as MoreHorizontalIcon,
} from "lucide-react"

type PaginationSize = "small" | "middle"
type PaginationItemType = "page" | "prev" | "next" | "jump-prev" | "jump-next"
type PaginationElement = number | "jump-prev" | "jump-next"
type PaginationAlign = "start" | "center" | "end"

type PaginationProps = Omit<React.ComponentProps<"nav">, "onChange"> & {
  align?: PaginationAlign
  current?: number
  defaultCurrent?: number
  defaultPageSize?: number
  disabled?: boolean
  hideOnSinglePage?: boolean
  itemRender?: (
    page: number,
    type: PaginationItemType,
    originalElement: React.ReactNode
  ) => React.ReactNode
  onChange?: (page: number, pageSize: number) => void
  onShowSizeChange?: (current: number, size: number) => void
  pageSize?: number
  pageSizeOptions?: Array<number | string>
  showLessItems?: boolean
  showQuickJumper?: boolean | { goButton?: React.ReactNode }
  showSizeChanger?: boolean
  showTotal?: (total: number, range: [number, number]) => React.ReactNode
  simple?: boolean | { readOnly?: boolean }
  size?: PaginationSize
  total?: number
}

function clampPage(page: number, pageCount: number) {
  if (!Number.isFinite(page)) {
    return 1
  }

  return Math.min(Math.max(1, Math.trunc(page)), pageCount)
}

function getPageCount(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)))
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getPaginationElements(
  current: number,
  pageCount: number,
  showLessItems: boolean
): PaginationElement[] {
  const siblingCount = showLessItems ? 0 : 1
  const sideItemCount = 3 + siblingCount * 2
  const maxVisibleCount = sideItemCount + 2

  if (pageCount <= maxVisibleCount) {
    return range(1, pageCount)
  }

  const left = Math.max(current - siblingCount, 2)
  const right = Math.min(current + siblingCount, pageCount - 1)
  const showLeftJump = left > 2
  const showRightJump = right < pageCount - 1

  if (!showLeftJump && showRightJump) {
    return [...range(1, sideItemCount), "jump-next", pageCount]
  }

  if (showLeftJump && !showRightJump) {
    return [1, "jump-prev", ...range(pageCount - sideItemCount + 1, pageCount)]
  }

  return [1, "jump-prev", ...range(left, right), "jump-next", pageCount]
}

function Pagination({
  align = "center",
  children,
  className,
  current,
  defaultCurrent = 1,
  defaultPageSize = 10,
  disabled = false,
  hideOnSinglePage = false,
  itemRender,
  onChange,
  onShowSizeChange,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  showLessItems = false,
  showQuickJumper = false,
  showSizeChanger = false,
  showTotal,
  simple = false,
  size = "middle",
  total = 0,
  ...props
}: PaginationProps) {
  const [innerCurrent, setInnerCurrent] = React.useState(defaultCurrent)
  const [innerPageSize, setInnerPageSize] = React.useState(defaultPageSize)
  const [quickPage, setQuickPage] = React.useState("")
  const mergedPageSize = Math.max(1, pageSize ?? innerPageSize)
  const pageCount = getPageCount(total, mergedPageSize)
  const mergedCurrent = clampPage(current ?? innerCurrent, pageCount)

  const buttonSize = size === "small" ? "small" : "middle"
  const itemButtonSize = size === "small" ? "small" : "small"
  const shouldHide = hideOnSinglePage && pageCount <= 1
  const rangeStart = total === 0 ? 0 : (mergedCurrent - 1) * mergedPageSize + 1
  const rangeEnd = Math.min(mergedCurrent * mergedPageSize, total)

  const changePage = (nextPage: number, nextPageSize = mergedPageSize) => {
    const nextPageCount = getPageCount(total, nextPageSize)
    const targetPage = clampPage(nextPage, nextPageCount)

    if (disabled || targetPage === mergedCurrent) {
      return
    }

    if (current === undefined) {
      setInnerCurrent(targetPage)
    }

    onChange?.(targetPage, nextPageSize)
  }

  const changePageSize = (nextPageSize: number) => {
    if (disabled) return
    const safePageSize = Math.max(1, nextPageSize)
    const nextPage = clampPage(mergedCurrent, getPageCount(total, safePageSize))

    if (pageSize === undefined) {
      setInnerPageSize(safePageSize)
    }
    if (current === undefined) {
      setInnerCurrent(nextPage)
    }

    onShowSizeChange?.(nextPage, safePageSize)
    onChange?.(nextPage, safePageSize)
  }

  const jumpToQuickPage = () => {
    if (!quickPage) return
    changePage(Number(quickPage))
    setQuickPage("")
  }

  const renderItem = (page: number, type: PaginationItemType, originalElement: React.ReactNode) => {
    return itemRender?.(page, type, originalElement) ?? originalElement
  }

  if (children) {
    return (
      <nav
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      >
        {children}
      </nav>
    )
  }

  if (shouldHide) {
    return null
  }

  const previousElement = (
    <Button
      aria-label="Go to previous page"
      disabled={disabled || mergedCurrent <= 1}
      onClick={() => changePage(mergedCurrent - 1)}
      shape="default"
      size={buttonSize}
      htmlType="button"
      variant="text"
      className="pl-2!"
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">Previous</span>
    </Button>
  )

  const nextElement = (
    <Button
      aria-label="Go to next page"
      disabled={disabled || mergedCurrent >= pageCount}
      onClick={() => changePage(mergedCurrent + 1)}
      shape="default"
      size={buttonSize}
      htmlType="button"
      variant="text"
      className="pr-2!"
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon data-icon="inline-end" />
    </Button>
  )

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(
        "mx-auto flex w-full flex-wrap items-center gap-3",
        align === "start" && "justify-start",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        className
      )}
      {...props}
    >
      {showTotal && (
        <div data-slot="pagination-total" className="text-sm text-muted-foreground">
          {showTotal(total, [rangeStart, rangeEnd])}
        </div>
      )}

      <PaginationContent>
        <PaginationItem>{renderItem(mergedCurrent - 1, "prev", previousElement)}</PaginationItem>

        {simple ? (
          <PaginationItem>
            {typeof simple === "object" && !simple.readOnly ? (
              <span className="flex h-8 items-center gap-1 text-sm tabular-nums text-muted-foreground">
                <input
                  aria-label="Page"
                  className="h-8 w-12 rounded border bg-background px-2 text-center text-foreground outline-none focus:ring-2 focus:ring-ring"
                  value={quickPage}
                  placeholder={String(mergedCurrent)}
                  disabled={disabled}
                  onChange={(event) => setQuickPage(event.target.value.replace(/\D/g, ""))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") jumpToQuickPage()
                  }}
                />
                <span>/</span>
                <span>{pageCount}</span>
              </span>
            ) : (
              <span className="flex h-8 items-center px-2 text-sm tabular-nums text-muted-foreground">
                <span className="text-foreground">{mergedCurrent}</span>
                <span className="px-1">/</span>
                <span>{pageCount}</span>
              </span>
            )}
          </PaginationItem>
        ) : (
          getPaginationElements(mergedCurrent, pageCount, showLessItems).map((item) => {
            if (item === "jump-prev" || item === "jump-next") {
              const targetPage = item === "jump-prev" ? mergedCurrent - 5 : mergedCurrent + 5
              const fallback = (
                <Button
                  aria-label={item === "jump-prev" ? "Jump to previous pages" : "Jump to next pages"}
                  disabled={disabled}
                  onClick={() => changePage(targetPage)}
                  shape="square"
                  size={itemButtonSize}
                  htmlType="button"
                  variant="text"
                >
                  <span className="sr-only">{item}</span>
                  <MoreHorizontalIcon />
                </Button>
              )

              return (
                <PaginationItem key={item}>
                  {renderItem(targetPage, item, fallback)}
                </PaginationItem>
              )
            }

            const isActive = item === mergedCurrent
            const pageElement = (
              <Button
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to page ${item}`}
                data-active={isActive}
                disabled={disabled}
                onClick={() => changePage(item)}
                shape="square"
                size={itemButtonSize}
                htmlType="button"
                variant={isActive ? "outlined" : "text"}
              >
                {item}
              </Button>
            )

            return (
              <PaginationItem key={item}>
                {renderItem(item, "page", pageElement)}
              </PaginationItem>
            )
          })
        )}

        <PaginationItem>{renderItem(mergedCurrent + 1, "next", nextElement)}</PaginationItem>
      </PaginationContent>

      {showSizeChanger && (
        <select
          aria-label="Page size"
          data-slot="pagination-size-changer"
          className="h-8 rounded border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          disabled={disabled}
          value={mergedPageSize}
          onChange={(event) => changePageSize(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => {
            const value = Number(option)
            return (
              <option key={String(option)} value={value}>
                {value} / page
              </option>
            )
          })}
        </select>
      )}

      {showQuickJumper && !simple && (
        <div data-slot="pagination-quick-jumper" className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Go to</span>
          <input
            aria-label="Jump to page"
            className="h-8 w-14 rounded border bg-background px-2 text-center outline-none focus:ring-2 focus:ring-ring"
            value={quickPage}
            disabled={disabled}
            onChange={(event) => setQuickPage(event.target.value.replace(/\D/g, ""))}
            onKeyDown={(event) => {
              if (event.key === "Enter") jumpToQuickPage()
            }}
          />
          {typeof showQuickJumper === "object" && showQuickJumper.goButton !== undefined ? (
            <button type="button" onClick={jumpToQuickPage} disabled={disabled}>
              {showQuickJumper.goButton}
            </button>
          ) : (
            <Button size="small" variant="outlined" htmlType="button" disabled={disabled} onClick={jumpToQuickPage}>
              Go
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size" | "shape"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "small",
  shape = "square",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant={isActive ? "outlined" : "text"}
      size={size}
      shape={shape}
      className={cn(className)}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="middle"
      shape="default"
      className={cn("pl-2!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="middle"
      shape="default"
      className={cn("pr-2!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationItemType,
  type PaginationAlign,
  type PaginationProps,
  type PaginationSize,
}
