import * as React from "react"
import { Slot } from "radix-ui"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/core/dropdown-menu"
import { cn } from "@/lib/utils"
import { ChevronDown as ChevronDownIcon, ChevronRight as ChevronRightIcon, MoveHorizontal as MoreHorizontalIcon } from "lucide-react"

type BreadcrumbParams = Record<string, string | number>

type BreadcrumbRouteItem = {
  key?: React.Key
  title?: React.ReactNode
  breadcrumbName?: string
  href?: string
  path?: string
  menu?: {
    items?: Array<{
      key?: React.Key
      title?: React.ReactNode
      label?: React.ReactNode
      href?: string
      path?: string
      onClick?: React.MouseEventHandler<HTMLAnchorElement>
    }>
  }
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>
  className?: string
  style?: React.CSSProperties
}

type BreadcrumbSeparatorItem = {
  key?: React.Key
  type: "separator"
  separator?: React.ReactNode
}

type BreadcrumbItemOption = BreadcrumbRouteItem | BreadcrumbSeparatorItem

type BreadcrumbProps = Omit<React.ComponentProps<"nav">, "children"> & {
  children?: React.ReactNode
  itemRender?: (
    item: BreadcrumbItemOption,
    params: BreadcrumbParams,
    items: BreadcrumbItemOption[],
    paths: string[],
  ) => React.ReactNode
  items?: BreadcrumbItemOption[]
  routes?: BreadcrumbItemOption[]
  params?: BreadcrumbParams
  separator?: React.ReactNode
  dropdownIcon?: React.ReactNode
}

function isSeparatorItem(item: BreadcrumbItemOption): item is BreadcrumbSeparatorItem {
  return "type" in item && item.type === "separator"
}

function mergePath(path: string, params: BreadcrumbParams) {
  return path.replace(/^\//, "").replace(/:([^/]+)/g, (_, key: string) => String(params[key] ?? `:${key}`))
}

function renderTitle(title: React.ReactNode, params: BreadcrumbParams) {
  if (typeof title !== "string") {
    return title
  }

  return title.replace(/:([^/]+)/g, (_, key: string) => String(params[key] ?? `:${key}`))
}

function Breadcrumb({
  children,
  className,
  itemRender,
  items,
  routes,
  params = {},
  separator,
  dropdownIcon,
  ...props
}: BreadcrumbProps) {
  const mergedItems = items ?? routes

  if (!mergedItems?.length) {
    return (
      <nav
        aria-label="breadcrumb"
        data-slot="breadcrumb"
        className={cn(className)}
        {...props}
      >
        {children}
      </nav>
    )
  }

  const paths: string[] = []

  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    >
      <BreadcrumbList>
        {mergedItems.map((item, index) => {
          const key = item.key ?? index

          if (isSeparatorItem(item)) {
            return <BreadcrumbSeparator key={key}>{item.separator}</BreadcrumbSeparator>
          }

          const routeItem = item
          const mergedPath = routeItem.path ? mergePath(routeItem.path, params) : undefined

          if (mergedPath !== undefined) {
            paths.push(mergedPath)
          }

          const isLast = index === mergedItems.length - 1
          const href = routeItem.href ?? (paths.length > 0 && mergedPath !== undefined ? `/${paths.join("/")}` : undefined)
          const title = renderTitle(routeItem.title ?? routeItem.breadcrumbName, params)
          const linkNode = href && !isLast ? (
            <BreadcrumbLink href={href} onClick={routeItem.onClick} className={routeItem.className}>
              {title}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage onClick={routeItem.onClick} className={routeItem.className}>
              {title}
            </BreadcrumbPage>
          )
          const originalNode = routeItem.menu?.items?.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="inline-flex items-center gap-1">
                  {linkNode}
                  {dropdownIcon ?? <ChevronDownIcon className="size-3" />}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {routeItem.menu.items.map((menuItem, menuIndex) => {
                  const label = menuItem.label ?? menuItem.title
                  const menuHref = menuItem.href ?? (menuItem.path ? `${href ?? ""}/${menuItem.path}` : undefined)

                  return (
                    <DropdownMenuItem
                      key={menuItem.key ?? menuIndex}
                      onSelect={() => {
                        if (menuHref) window.location.href = menuHref
                      }}
                    >
                      {label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : linkNode
          const node = itemRender?.(item, params, mergedItems, paths) ?? originalNode

          return (
            <React.Fragment key={key}>
              <BreadcrumbItem>{node}</BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </nav>
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? (
        <ChevronRightIcon />
      )}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon
      />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  type BreadcrumbItemOption,
  type BreadcrumbParams,
  type BreadcrumbProps,
}
