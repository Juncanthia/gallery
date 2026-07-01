"use client"

import * as React from "react"

import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
} from "@/components/ui/button"

type ExtendButtonVariant =
  | "default"
  | "destructive"
  | "destructive-outline"
  | "ghost"
  | "link"
  | "outline"
  | "secondary"

type ExtendButtonSize =
  | "default"
  | "icon"
  | "icon-lg"
  | "icon-sm"
  | "icon-xl"
  | "icon-xs"
  | "lg"
  | "sm"
  | "xl"
  | "xs"

type ButtonProps = Omit<
  BaseButtonProps,
  "color" | "htmlType" | "shape" | "size" | "variant"
> & {
  color?: BaseButtonProps["color"]
  htmlType?: BaseButtonProps["htmlType"]
  shape?: BaseButtonProps["shape"]
  size?: ExtendButtonSize
  type?: "button" | "submit" | "reset"
  variant?: ExtendButtonVariant
}

function mapVariant(variant: ExtendButtonVariant | undefined): Pick<
  BaseButtonProps,
  "color" | "variant"
> {
  switch (variant) {
    case "default":
      return { color: "primary", variant: "solid" }
    case "destructive":
      return { color: "danger", variant: "solid" }
    case "destructive-outline":
      return { color: "danger", variant: "outlined" }
    case "ghost":
      return { variant: "text" }
    case "link":
      return { color: "primary", variant: "link" }
    case "outline":
      return { variant: "outlined" }
    case "secondary":
      return { variant: "filled" }
    default:
      return { color: "primary", variant: "solid" }
  }
}

function mapSize(size: ExtendButtonSize | undefined): Pick<
  BaseButtonProps,
  "shape" | "size"
> {
  switch (size) {
    case "icon":
    case "icon-sm":
    case "icon-xs":
      return { shape: "square", size: "small" }
    case "icon-lg":
    case "icon-xl":
      return { shape: "square", size: "large" }
    case "lg":
    case "xl":
      return { size: "large" }
    case "sm":
    case "xs":
      return { size: "small" }
    default:
      return {}
  }
}

function Button({
  color,
  htmlType,
  shape,
  size,
  type,
  variant,
  ...props
}: ButtonProps): React.ReactElement {
  const variantProps = mapVariant(variant)
  const sizeProps = mapSize(size)

  return (
    <BaseButton
      color={color ?? variantProps.color}
      htmlType={htmlType ?? type}
      shape={shape ?? sizeProps.shape}
      size={sizeProps.size}
      variant={variantProps.variant}
      {...props}
    />
  )
}

export { Button }
export type { ButtonProps, ExtendButtonSize, ExtendButtonVariant }
