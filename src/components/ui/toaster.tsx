import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheck as CircleCheckIcon,
  Info as InfoIcon,
  Loader as Loader2Icon,
  OctagonX as OctagonXIcon,
  TriangleAlert as TriangleAlertIcon,
} from "lucide-react"

const Toaster = ({
  icons,
  style,
  theme = "system",
  toastOptions,
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
        ...icons,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          ...style,
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: "cn-toast",
          description: "!text-current !opacity-80",
          success: "!border-l-4 !border-l-green-500 [&_svg]:!text-green-500",
          error: "!border-l-4 !border-l-red-500 [&_svg]:!text-red-500",
          warning: "!border-l-4 !border-l-amber-500 [&_svg]:!text-amber-500",
          info: "!border-l-4 !border-l-blue-500 [&_svg]:!text-blue-500",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
