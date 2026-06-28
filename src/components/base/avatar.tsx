import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type AvatarShape = "circle" | "square"
type AvatarSize = "sm" | "small" | "default" | "middle" | "lg" | "large" | number

type AvatarProps = Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, "children"> & {
  size?: AvatarSize
  shape?: AvatarShape
  src?: string
  srcSet?: string
  alt?: string
  icon?: React.ReactNode
  gap?: number
  children?: React.ReactNode
  imageProps?: Omit<React.ComponentProps<typeof AvatarPrimitive.Image>, "src" | "srcSet" | "alt">
  fallbackProps?: React.ComponentProps<typeof AvatarPrimitive.Fallback>
}

type AvatarItem = Omit<AvatarProps, "children"> & {
  key?: React.Key
  label?: React.ReactNode
  children?: React.ReactNode
}

type AvatarGroupProps = React.ComponentProps<"div"> & {
  items?: AvatarItem[]
  max?: number | { count?: number; render?: (omittedCount: number, omittedItems: AvatarItem[]) => React.ReactNode }
  size?: AvatarSize
  shape?: AvatarShape
}

function getSizeValue(size: AvatarSize) {
  if (typeof size === "number") {
    return size
  }

  if (size === "sm" || size === "small") {
    return 24
  }

  if (size === "lg" || size === "large") {
    return 40
  }

  return 32
}

function getSizeName(size: AvatarSize) {
  if (size === "small") {
    return "sm"
  }

  if (size === "middle") {
    return "default"
  }

  if (size === "large") {
    return "lg"
  }

  return typeof size === "number" ? "custom" : size
}

function Avatar({
  className,
  size = "default",
  shape = "circle",
  src,
  srcSet,
  alt,
  icon,
  gap = 4,
  children,
  imageProps,
  fallbackProps,
  style,
  ...props
}: AvatarProps) {
  const sizeValue = getSizeValue(size)
  const isComposed = src === undefined && icon === undefined
  const fallbackContent = icon ?? children

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={getSizeName(size)}
      data-shape={shape}
      className={cn(
        "group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
        shape === "circle" ? "rounded-full after:rounded-full" : "rounded after:rounded",
        className
      )}
      style={{ width: sizeValue, height: sizeValue, fontSize: Math.max(12, Math.floor((sizeValue - gap * 2) / 2)), ...style }}
      {...props}
    >
      {isComposed ? (
        children
      ) : (
        <>
          {src ? <AvatarImage src={src} srcSet={srcSet} alt={alt} {...imageProps} /> : null}
          <AvatarFallback {...fallbackProps}>{fallbackContent}</AvatarFallback>
        </>
      )}
    </AvatarPrimitive.Root>
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover group-data-[shape=circle]/avatar:rounded-full group-data-[shape=square]/avatar:rounded",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs group-data-[shape=circle]/avatar:rounded-full group-data-[shape=square]/avatar:rounded",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, children, items, max, size, shape, ...props }: AvatarGroupProps) {
  const count = typeof max === "number" ? max : max?.count
  const nodes = items?.map((item, index) => {
    const { key, label, children: itemChildren, ...avatarProps } = item

    return (
      <Avatar key={key ?? index} size={avatarProps.size ?? size} shape={avatarProps.shape ?? shape} {...avatarProps}>
        {itemChildren ?? label}
      </Avatar>
    )
  }) ?? React.Children.toArray(children)
  const visibleNodes = count && count > 0 && nodes.length > count ? nodes.slice(0, count) : nodes
  const omittedItems = count && items && nodes.length > count ? items.slice(count) : []
  const omittedCount = count && nodes.length > count ? nodes.length - count : 0

  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    >
      {visibleNodes}
      {omittedCount > 0 ? (
        <AvatarGroupCount style={{ width: getSizeValue(size ?? "default"), height: getSizeValue(size ?? "default") }}>
          {typeof max === "object" && max.render ? max.render(omittedCount, omittedItems) : `+${omittedCount}`}
        </AvatarGroupCount>
      ) : null}
    </div>
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background [&>svg]:size-4",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
export type { AvatarProps, AvatarGroupProps, AvatarItem, AvatarShape, AvatarSize }
