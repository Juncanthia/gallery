import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu-variants"
import { cn } from "@/lib/utils"
import { ChevronDown as ChevronDownIcon } from "lucide-react"

type NavigationMenuSelectInfo = {
  key: React.Key
  keyPath: React.Key[]
  selectedKeys: React.Key[]
  item: NavigationMenuItemOption
  domEvent: React.MouseEvent
}

type NavigationMenuItemOption =
  | {
      key?: React.Key
      type: "divider"
    }
  | {
      key?: React.Key
      type: "group"
      label: React.ReactNode
      children?: NavigationMenuItemOption[]
    }
  | {
      key?: React.Key
      type?: "item"
      label: React.ReactNode
      icon?: React.ReactNode
      extra?: React.ReactNode
      description?: React.ReactNode
      href?: string
      content?: React.ReactNode
      disabled?: boolean
      danger?: boolean
      onSelect?: (event: React.MouseEvent) => void
      children?: NavigationMenuItemOption[]
    }

type NavigationMenuProps = Omit<
  React.ComponentProps<typeof NavigationMenuPrimitive.Root>,
  "onSelect"
> & {
  viewport?: boolean
  items?: NavigationMenuItemOption[]
  selectedKeys?: React.Key[]
  defaultSelectedKeys?: React.Key[]
  onSelect?: (info: NavigationMenuSelectInfo) => void
  listProps?: React.ComponentProps<typeof NavigationMenuPrimitive.List>
}

type NavigationMenuLabelItem = Extract<
  NavigationMenuItemOption,
  { type?: "item" }
>

function isSelected(key: React.Key | undefined, selectedKeys: React.Key[]) {
  if (key === undefined) return false
  return selectedKeys.some((selectedKey) => String(selectedKey) === String(key))
}

function getItemKey(
  item: NavigationMenuItemOption,
  index: number,
  parentKeys: React.Key[]
) {
  return item.key ?? [...parentKeys, index].join("-")
}

function renderNavigationLabel(item: NavigationMenuLabelItem) {
  return (
    <>
      {item.icon}
      <span>{item.label}</span>
      {item.extra && (
        <span className="ml-1 text-xs text-muted-foreground">{item.extra}</span>
      )}
    </>
  )
}

function renderNavigationContentItems(
  items: NavigationMenuItemOption[],
  selectedKeys: React.Key[],
  onItemSelect: (
    item: NavigationMenuItemOption,
    key: React.Key,
    keyPath: React.Key[],
    event: React.MouseEvent
  ) => void,
  parentKeys: React.Key[] = []
) {
  return items.map((item, index) => {
    const key = getItemKey(item, index, parentKeys)

    if (item.type === "divider") {
      return <div key={String(key)} className="col-span-full h-px bg-border" />
    }

    if (item.type === "group") {
      return (
        <div key={String(key)} className="col-span-full space-y-1">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            {item.label}
          </div>
          <div className="grid gap-1">
            {item.children &&
              renderNavigationContentItems(item.children, selectedKeys, onItemSelect, [
                key,
                ...parentKeys,
              ])}
          </div>
        </div>
      )
    }

    const selected = isSelected(key, selectedKeys)
    const content = (
      <>
        <div className="flex items-center gap-2">
          {item.icon}
          <span className="font-medium">{item.label}</span>
          {item.extra && (
            <span className="ml-auto text-xs text-muted-foreground">{item.extra}</span>
          )}
        </div>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </>
    )

    return (
      <NavigationMenuLink
        key={String(key)}
        asChild
        active={selected}
        disabled={item.disabled}
        danger={item.danger}
      >
        {item.href ? (
          <a
            href={item.href}
            onClick={(event) => {
              if (item.disabled) {
                event.preventDefault()
                return
              }
              item.onSelect?.(event)
              if (!event.defaultPrevented) {
                onItemSelect(item, key, [key, ...parentKeys], event)
              }
            }}
          >
            {content}
          </a>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              if (item.disabled) return
              item.onSelect?.(event)
              if (!event.defaultPrevented) {
                onItemSelect(item, key, [key, ...parentKeys], event)
              }
            }}
          >
            {content}
          </button>
        )}
      </NavigationMenuLink>
    )
  })
}

function renderNavigationItems(
  items: NavigationMenuItemOption[],
  selectedKeys: React.Key[],
  onItemSelect: (
    item: NavigationMenuItemOption,
    key: React.Key,
    keyPath: React.Key[],
    event: React.MouseEvent
  ) => void
) {
  return items.map((item, index) => {
    const key = getItemKey(item, index, [])

    if (item.type === "divider" || item.type === "group") return null

    const selected = isSelected(key, selectedKeys)
    const hasPanel = item.content !== undefined || item.children !== undefined

    return (
      <NavigationMenuItem key={String(key)}>
        {hasPanel ? (
          <>
            <NavigationMenuTrigger
              disabled={item.disabled}
              selected={selected}
              danger={item.danger}
            >
              {renderNavigationLabel(item)}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[420px] gap-2 p-2">
                {item.content}
                {item.children &&
                  renderNavigationContentItems(item.children, selectedKeys, onItemSelect, [
                    key,
                  ])}
              </div>
            </NavigationMenuContent>
          </>
        ) : (
          <NavigationMenuLink
            asChild
            active={selected}
            disabled={item.disabled}
            danger={item.danger}
          >
            {item.href ? (
              <a
                href={item.href}
                onClick={(event) => {
                  if (item.disabled) {
                    event.preventDefault()
                    return
                  }
                  item.onSelect?.(event)
                  if (!event.defaultPrevented) {
                    onItemSelect(item, key, [key], event)
                  }
                }}
              >
                {renderNavigationLabel(item)}
              </a>
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  if (item.disabled) return
                  item.onSelect?.(event)
                  if (!event.defaultPrevented) {
                    onItemSelect(item, key, [key], event)
                  }
                }}
              >
                {renderNavigationLabel(item)}
              </button>
            )}
          </NavigationMenuLink>
        )}
      </NavigationMenuItem>
    )
  })
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  items,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
  listProps,
  ...props
}: NavigationMenuProps) {
  const [innerSelectedKeys, setInnerSelectedKeys] = React.useState<React.Key[]>(
    defaultSelectedKeys ?? []
  )
  const mergedSelectedKeys = selectedKeys ?? innerSelectedKeys

  function handleItemSelect(
    item: NavigationMenuItemOption,
    key: React.Key,
    keyPath: React.Key[],
    domEvent: React.MouseEvent
  ) {
    const nextSelectedKeys = [key]
    if (selectedKeys === undefined) {
      setInnerSelectedKeys(nextSelectedKeys)
    }
    onSelect?.({ key, keyPath, selectedKeys: nextSelectedKeys, item, domEvent })
  }

  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {items ? (
        <NavigationMenuList {...listProps}>
          {renderNavigationItems(items, mergedSelectedKeys, handleItemSelect)}
        </NavigationMenuList>
      ) : (
        children
      )}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  selected,
  danger,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
  selected?: boolean
  danger?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      data-selected={selected}
      data-danger={danger}
      className={cn(
        navigationMenuTriggerStyle(),
        "group gap-1.5 data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[danger=true]:text-destructive",
        className
      )}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-2 pr-2.5 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 md:w-(--radix-navigation-menu-viewport-width) data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  disabled,
  danger,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      data-disabled={disabled}
      data-danger={danger}
      aria-disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 rounded-md p-2 text-left text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-sm data-[active=true]:bg-muted/50 data-[active=true]:hover:bg-muted data-[active=true]:focus:bg-muted data-[danger=true]:text-destructive data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  type NavigationMenuProps,
  type NavigationMenuItemOption,
  type NavigationMenuSelectInfo,
}
