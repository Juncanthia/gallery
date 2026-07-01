"use client"

import * as React from "react"

import {
  Tabs as BaseTabs,
  TabsContent as BaseTabsContent,
  TabsList as BaseTabsList,
  TabsTrigger as BaseTabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/components/extend/lib/utils"

export type TabsVariant = "default" | "underline"

export function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs>): React.ReactElement {
  return (
    <BaseTabs
      className={cn("data-[orientation=vertical]:flex-row", className)}
      data-slot="tabs"
      {...props}
    />
  )
}

export function TabsList({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<typeof BaseTabsList> & {
  variant?: TabsVariant
}): React.ReactElement {
  return (
    <BaseTabsList
      className={cn(
        variant === "underline" &&
          "bg-transparent p-0 shadow-none data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-r",
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  )
}

export function TabsTab({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabsTrigger>): React.ReactElement {
  return (
    <BaseTabsTrigger
      className={cn("data-[orientation=vertical]:justify-start", className)}
      data-slot="tabs-tab"
      {...props}
    />
  )
}

export function TabsPanel({
  className,
  keepMounted = false,
  ...props
}: React.ComponentProps<typeof BaseTabsContent> & {
  keepMounted?: boolean
}): React.ReactElement {
  return (
    <BaseTabsContent
      className={cn("data-[state=inactive]:hidden", className)}
      data-slot="tabs-content"
      forceMount={keepMounted ? true : undefined}
      {...props}
    />
  )
}

export {
  BaseTabs as TabsPrimitive,
  TabsPanel as TabsContent,
  TabsTab as TabsTrigger,
}
