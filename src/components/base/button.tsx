import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"
import { motion } from "motion/react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import {
  buttonVariants,
  type ButtonVariant,
} from "@/components/base/button-variants"

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean
  htmlType?: "button" | "submit" | "reset"
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPlacement?: "start" | "end"
  hoverScale?: number
  tapScale?: number
}

type ButtonNativeProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children" | "color" | "onClick" | "type"
> &
  Pick<React.ComponentPropsWithoutRef<"a">, "download" | "href" | "rel" | "target"> & {
    children?: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  }

type ButtonProps = ButtonNativeProps & ButtonOwnProps

const isTextLikeVariant = (variant: ButtonVariant) =>
  variant === "text" || variant === "link"

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      className,
      color = "default",
      variant = "outlined",
      size = "middle",
      shape = "default",
      block = false,
      ghost = false,
      asChild = false,
      htmlType = "button",
      loading = false,
      loadingText,
      icon,
      iconPlacement = "start",
      hoverScale = 1.02,
      tapScale = 0.97,
      children,
      disabled,
      href,
      onClick,
      ...props
    },
    ref
  ) {
  const mergedColor = color ?? "default"
  const mergedVariant = variant ?? "outlined"
  const mergedSize = size ?? "middle"
  const normalizedShape = shape ?? "default"
  const mergedDisabled = disabled || loading
  const effectiveGhost = Boolean(ghost) && !isTextLikeVariant(mergedVariant)
  const isIconOnly = !children && !!icon
  const mergedShape = isIconOnly && normalizedShape === "default" ? "square" : normalizedShape
  const effectiveHoverScale = hoverScale
  const effectiveTapScale = tapScale
  const content = loading && loadingText ? loadingText : children
  const iconNode = loading ? (
    <LoaderCircle className="animate-spin" />
  ) : (
    icon
  )
  const iconMarkup = iconNode ? (
    <span
      data-icon={iconPlacement === "end" ? "inline-end" : "inline-start"}
      className="inline-flex shrink-0 items-center justify-center"
    >
      {iconNode}
    </span>
  ) : null
  const mergedClassName = cn(
    buttonVariants({
      color: mergedColor,
      variant: mergedVariant,
      size: mergedSize,
      shape: mergedShape,
      block,
      ghost: effectiveGhost,
      className,
    })
  )
  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (mergedDisabled) {
      event.preventDefault()
      return
    }

    onClick?.(event)
  }

  if (asChild) {
    return (
      <Slot.Root
        {...(props as unknown as React.ComponentPropsWithoutRef<typeof Slot.Root>)}
        data-slot="button"
        data-color={mergedColor}
        data-variant={mergedVariant}
        data-size={mergedSize}
        data-shape={mergedShape}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        aria-disabled={mergedDisabled || undefined}
        className={mergedClassName}
        ref={ref}
        onClick={handleClick}
      >
        {children}
      </Slot.Root>
    )
  }

  if (href !== undefined) {
    return (
      <motion.a
        {...(props as unknown as React.ComponentPropsWithoutRef<typeof motion.a>)}
        data-slot="button"
        data-color={mergedColor}
        data-variant={mergedVariant}
        data-size={mergedSize}
        data-shape={mergedShape}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        aria-disabled={mergedDisabled || undefined}
        className={mergedClassName}
        href={mergedDisabled ? undefined : href}
        onClick={handleClick}
        ref={ref as React.Ref<HTMLAnchorElement>}
        tabIndex={mergedDisabled ? -1 : props.tabIndex}
        whileTap={{ scale: effectiveTapScale }}
        whileHover={{ scale: effectiveHoverScale }}
      >
        {iconPlacement === "start" && iconMarkup}
        {content}
        {iconPlacement === "end" && iconMarkup}
      </motion.a>
    )
  }

  return (
    <motion.button
      {...(props as unknown as React.ComponentPropsWithoutRef<typeof motion.button>)}
      data-slot="button"
      data-color={mergedColor}
      data-variant={mergedVariant}
      data-size={mergedSize}
      data-shape={mergedShape}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      className={mergedClassName}
      disabled={mergedDisabled}
      type={htmlType}
      onClick={handleClick}
      ref={ref as React.Ref<HTMLButtonElement>}
      whileTap={{ scale: effectiveTapScale }}
      whileHover={{ scale: effectiveHoverScale }}
    >
      {iconPlacement === "start" && iconMarkup}
      {content}
      {iconPlacement === "end" && iconMarkup}
    </motion.button>
  )
  }
)

export {
  Button,
  type ButtonProps,
  type ButtonVariant,
}
export type { ButtonColor, ButtonShape, ButtonSize } from "@/components/base/button-variants"
