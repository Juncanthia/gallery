import * as React from "react"
import { Inbox as InboxIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type EmptyProps = React.ComponentProps<"div"> & {
  image?: React.ReactNode | string | false
  imageStyle?: React.CSSProperties
  imageClassName?: string
  description?: React.ReactNode
  actions?: React.ReactNode
  simple?: boolean
  footerClassName?: string
  descriptionClassName?: string
}

function DefaultEmptyImage({ simple }: { simple?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded border border-dashed bg-muted/40 text-muted-foreground",
        simple ? "size-12" : "h-20 w-28"
      )}
      aria-hidden="true"
    >
      <InboxIcon className={cn(simple ? "size-5" : "size-8")} />
    </div>
  )
}

function renderImage(image: EmptyProps["image"], simple?: boolean) {
  if (image === false) {
    return null
  }

  if (typeof image === "string") {
    return <img src={image} alt="empty" draggable={false} />
  }

  return image ?? <DefaultEmptyImage simple={simple} />
}

function Empty({
  className,
  children,
  image,
  imageStyle,
  imageClassName,
  description,
  actions,
  simple,
  footerClassName,
  descriptionClassName,
  ...props
}: EmptyProps) {
  const hasApiContent = image !== undefined || description !== undefined || actions !== undefined || simple

  if (!hasApiContent) {
    return (
      <div
        data-slot="empty"
        className={cn(
          "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded border border-dashed p-12 text-center text-balance",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  const imageNode = renderImage(image, simple)

  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded border border-dashed p-10 text-center text-balance",
        simple && "gap-2 p-6",
        className
      )}
      {...props}
    >
      {imageNode ? (
        <EmptyMedia className={imageClassName} style={imageStyle}>
          {imageNode}
        </EmptyMedia>
      ) : null}
      {description !== false ? (
        <EmptyDescription className={descriptionClassName}>
          {description ?? "No data"}
        </EmptyDescription>
      ) : null}
      {actions ?? children ? <EmptyContent className={footerClassName}>{actions ?? children}</EmptyContent> : null}
    </div>
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-heading text-lg font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
export type { EmptyProps }
