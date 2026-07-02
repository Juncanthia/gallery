"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "radix-ui"

import { cn } from "@/_internals/foundations/utils/cn"
import {
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react"

type MenubarItemSelectEvent = Parameters<
  NonNullable<React.ComponentProps<typeof MenubarPrimitive.Item>["onSelect"]>
>[0]

type MenubarSelectInfo = {
  key: React.Key
  keyPath: React.Key[]
  selectedKeys: React.Key[]
  item: MenubarItemOption
  domEvent: MenubarItemSelectEvent | React.MouseEvent
}

type MenubarItemOption =
  | {
      key?: React.Key
      type: "divider"
    }
  | {
      key?: React.Key
      type: "group"
      label: React.ReactNode
      children?: MenubarItemOption[]
    }
  | {
      key?: React.Key
      type?: "item"
      label: React.ReactNode
      icon?: React.ReactNode
      extra?: React.ReactNode
      shortcut?: React.ReactNode
      disabled?: boolean
      danger?: boolean
      onSelect?: React.ComponentProps<typeof MenubarPrimitive.Item>["onSelect"]
    }
  | {
      key?: React.Key
      type: "submenu"
      label: React.ReactNode
      icon?: React.ReactNode
      extra?: React.ReactNode
      disabled?: boolean
      danger?: boolean
      children: MenubarItemOption[]
    }

type MenubarLabelItem =
  | Extract<MenubarItemOption, { type?: "item" }>
  | Extract<MenubarItemOption, { type: "submenu" }>

type MenubarProps = Omit<
  React.ComponentProps<typeof MenubarPrimitive.Root>,
  "onSelect"
> & {
  items?: MenubarItemOption[]
  selectedKeys?: React.Key[]
  defaultSelectedKeys?: React.Key[]
  onSelect?: (info: MenubarSelectInfo) => void
  contentProps?: React.ComponentProps<typeof MenubarPrimitive.Content>
}

function isSelected(key: React.Key | undefined, selectedKeys: React.Key[]) {
  if (key === undefined) return false
  return selectedKeys.some((selectedKey) => String(selectedKey) === String(key))
}

function getItemKey(item: MenubarItemOption, index: number, parentKeys: React.Key[]) {
  return item.key ?? [...parentKeys, index].join("-")
}

function renderMenubarItemLabel(item: MenubarLabelItem) {
  return (
    <>
      {item.icon}
      <span className="truncate">{item.label}</span>
      {item.extra && <MenubarShortcut>{item.extra}</MenubarShortcut>}
    </>
  )
}

function renderMenubarItems(
  items: MenubarItemOption[],
  selectedKeys: React.Key[],
  onItemSelect: (
    item: MenubarItemOption,
    key: React.Key,
    keyPath: React.Key[],
    event: MenubarItemSelectEvent | React.MouseEvent
  ) => void,
  parentKeys: React.Key[] = []
) {
  return items.map((item, index) => {
    const key = getItemKey(item, index, parentKeys)

    if (item.type === "divider") {
      return <MenubarSeparator key={String(key)} />
    }

    if (item.type === "group") {
      return (
        <MenubarGroup key={String(key)}>
          <MenubarLabel>{item.label}</MenubarLabel>
          {item.children && renderMenubarItems(item.children, selectedKeys, onItemSelect, [
            key,
            ...parentKeys,
          ])}
        </MenubarGroup>
      )
    }

    if (item.type === "submenu") {
      return (
        <MenubarSub key={String(key)}>
          <MenubarSubTrigger disabled={item.disabled} danger={item.danger}>
            {renderMenubarItemLabel(item)}
          </MenubarSubTrigger>
          <MenubarSubContent>
            {renderMenubarItems(item.children, selectedKeys, onItemSelect, [
              key,
              ...parentKeys,
            ])}
          </MenubarSubContent>
        </MenubarSub>
      )
    }

    return (
      <MenubarItem
        key={String(key)}
        disabled={item.disabled}
        selected={isSelected(key, selectedKeys)}
        variant={item.danger ? "destructive" : "default"}
        onSelect={(event) => {
          item.onSelect?.(event)
          if (!event.defaultPrevented) {
            onItemSelect(item, key, [key, ...parentKeys], event)
          }
        }}
      >
        {renderMenubarItemLabel(item)}
        {(item.shortcut && !item.extra) && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
      </MenubarItem>
    )
  })
}

function renderMenubarTopItems(
  items: MenubarItemOption[],
  selectedKeys: React.Key[],
  contentProps: MenubarProps["contentProps"],
  onItemSelect: (
    item: MenubarItemOption,
    key: React.Key,
    keyPath: React.Key[],
    event: MenubarItemSelectEvent | React.MouseEvent
  ) => void
) {
  return items.map((item, index) => {
    const key = getItemKey(item, index, [])

    if (item.type === "divider") return null

    if (item.type === "group") {
      return (
        <MenubarMenu key={String(key)}>
          <MenubarTrigger selected={isSelected(key, selectedKeys)}>
            {item.label}
            <ChevronDownIcon className="size-3" />
          </MenubarTrigger>
          <MenubarContent {...contentProps}>
            {item.children && renderMenubarItems(item.children, selectedKeys, onItemSelect, [key])}
          </MenubarContent>
        </MenubarMenu>
      )
    }

    if (item.type === "submenu") {
      return (
        <MenubarMenu key={String(key)}>
          <MenubarTrigger
            disabled={item.disabled}
            selected={isSelected(key, selectedKeys)}
            danger={item.danger}
          >
            {renderMenubarItemLabel(item)}
            <ChevronDownIcon className="size-3" />
          </MenubarTrigger>
          <MenubarContent {...contentProps}>
            {renderMenubarItems(item.children, selectedKeys, onItemSelect, [key])}
          </MenubarContent>
        </MenubarMenu>
      )
    }

    return (
      <MenubarMenu key={String(key)}>
        <MenubarTrigger
          disabled={item.disabled}
          selected={isSelected(key, selectedKeys)}
          danger={item.danger}
          onClick={(event) => {
            if (item.disabled) return
            onItemSelect(item, key, [key], event)
          }}
        >
          {renderMenubarItemLabel(item)}
        </MenubarTrigger>
      </MenubarMenu>
    )
  })
}

function Menubar({
  className,
  items,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
  contentProps,
  children,
  ...props
}: MenubarProps) {
  const [innerSelectedKeys, setInnerSelectedKeys] = React.useState<React.Key[]>(
    defaultSelectedKeys ?? []
  )
  const mergedSelectedKeys = selectedKeys ?? innerSelectedKeys

  function handleItemSelect(
    item: MenubarItemOption,
    key: React.Key,
    keyPath: React.Key[],
    domEvent: MenubarItemSelectEvent | React.MouseEvent
  ) {
    const nextSelectedKeys = [key]
    if (selectedKeys === undefined) {
      setInnerSelectedKeys(nextSelectedKeys)
    }
    onSelect?.({ key, keyPath, selectedKeys: nextSelectedKeys, item, domEvent })
  }

  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className
      )}
      {...props}
    >
      {children}
      {items &&
        renderMenubarTopItems(
          items,
          mergedSelectedKeys,
          contentProps,
          handleItemSelect
        )}
    </MenubarPrimitive.Root>
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarTrigger({
  className,
  selected,
  danger,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger> & {
  selected?: boolean
  danger?: boolean
}) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      data-selected={selected}
      data-danger={danger}
      className={cn(
        "flex items-center gap-1.5 rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted data-[selected=true]:bg-muted data-[selected=true]:text-foreground data-[danger=true]:text-destructive disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn("z-50 min-w-36 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95", className )}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  selected,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  selected?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-selected={selected}
      data-variant={variant}
      className={cn(
        "group/menubar-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-inset:pl-8",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  danger,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
  danger?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      data-danger={danger}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-8 data-open:bg-accent data-open:text-accent-foreground data-[danger=true]:text-destructive [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn("z-50 min-w-32 origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  type MenubarProps,
  type MenubarItemOption,
  type MenubarSelectInfo,
}
