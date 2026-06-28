import * as React from "react"

import { cn } from "@/lib/utils"

type SkeletonSize = "sm" | "default" | "lg"
type SkeletonShape = "default" | "circle" | "square"

type SkeletonAvatarConfig = {
  size?: SkeletonSize | number
  shape?: "circle" | "square"
  className?: string
}

type SkeletonTitleConfig = {
  width?: number | string
  className?: string
}

type SkeletonParagraphConfig = {
  rows?: number
  width?: number | string | Array<number | string>
  className?: string
}

type SkeletonProps = Omit<React.ComponentProps<"div">, "title"> & {
  active?: boolean
  loading?: boolean
  avatar?: boolean | SkeletonAvatarConfig
  title?: boolean | SkeletonTitleConfig
  paragraph?: boolean | SkeletonParagraphConfig
  round?: boolean
}

function toWidth(value: number | string | undefined) {
  if (value === undefined) return undefined
  return typeof value === "number" ? `${value}%` : value
}

function getAvatarSize(size: SkeletonAvatarConfig["size"]) {
  if (typeof size === "number") return `${size}px`
  if (size === "sm") return "32px"
  if (size === "lg") return "48px"
  return "40px"
}

function SkeletonBlock({
  className,
  active,
  round,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  active?: boolean
  round?: boolean
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        active && "animate-pulse",
        round ? "rounded-full" : "rounded-md",
        "bg-muted",
        className
      )}
      style={style}
      {...props}
    />
  )
}

function Skeleton({
  className,
  active = true,
  loading,
  avatar,
  title,
  paragraph,
  round,
  children,
  ...props
}: SkeletonProps) {
  const hasApiShape =
    loading !== undefined ||
    avatar !== undefined ||
    title !== undefined ||
    paragraph !== undefined ||
    round !== undefined ||
    children !== undefined

  if (!hasApiShape) {
    return <SkeletonBlock active={active} round={round} className={className} {...props} />
  }

  if (loading === false) return children ?? null

  const avatarConfig = typeof avatar === "object" ? avatar : undefined
  const titleConfig = typeof title === "object" ? title : undefined
  const paragraphConfig = typeof paragraph === "object" ? paragraph : undefined
  const showAvatar = Boolean(avatar)
  const showTitle = title !== false
  const showParagraph = paragraph !== false
  const rows = paragraphConfig?.rows ?? (showAvatar ? 2 : 3)
  const defaultTitleWidth = showAvatar ? "50%" : showParagraph ? "38%" : "100%"

  return (
    <div
      data-slot="skeleton-root"
      className={cn("flex w-full gap-3", className)}
      {...props}
    >
      {showAvatar && (
        <SkeletonBlock
          active={active}
          round={avatarConfig?.shape !== "square"}
          className={cn("shrink-0", avatarConfig?.className)}
          style={{
            width: getAvatarSize(avatarConfig?.size),
            height: getAvatarSize(avatarConfig?.size),
          }}
        />
      )}
      <div className="min-w-0 flex-1 space-y-2">
        {showTitle && (
          <SkeletonBlock
            active={active}
            round={round}
            className={cn("h-4", titleConfig?.className)}
            style={{ width: toWidth(titleConfig?.width) ?? defaultTitleWidth }}
          />
        )}
        {showParagraph && (
          <div className={cn("space-y-2", paragraphConfig?.className)}>
            {Array.from({ length: rows }, (_, index) => {
              const rowWidth = Array.isArray(paragraphConfig?.width)
                ? paragraphConfig.width[index]
                : paragraphConfig?.width
              const fallbackWidth = index === rows - 1 ? "61%" : "100%"

              return (
                <SkeletonBlock
                  key={index}
                  active={active}
                  round={round}
                  className="h-3"
                  style={{ width: toWidth(rowWidth) ?? fallbackWidth }}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function SkeletonAvatar({
  className,
  size = "default",
  shape = "circle",
  active = true,
  ...props
}: React.ComponentProps<"div"> & SkeletonAvatarConfig & { active?: boolean }) {
  return (
    <SkeletonBlock
      active={active}
      round={shape === "circle"}
      className={cn("shrink-0", className)}
      style={{ width: getAvatarSize(size), height: getAvatarSize(size) }}
      {...props}
    />
  )
}

function SkeletonButton({
  className,
  size = "default",
  active = true,
  block,
  ...props
}: React.ComponentProps<"div"> & {
  size?: SkeletonSize
  active?: boolean
  block?: boolean
}) {
  return (
    <SkeletonBlock
      active={active}
      className={cn(
        size === "sm" ? "h-8" : size === "lg" ? "h-10" : "h-9",
        block ? "w-full" : "w-20",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton, SkeletonAvatar, SkeletonButton }
export type {
  SkeletonAvatarConfig,
  SkeletonParagraphConfig,
  SkeletonProps,
  SkeletonShape,
  SkeletonSize,
  SkeletonTitleConfig,
}
