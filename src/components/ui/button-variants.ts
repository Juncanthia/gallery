import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      color: {
        default: "",
        primary: "",
        danger: "",
        success: "",
        warning: "",
        info: "",
      },
      variant: {
        solid: "",
        outlined: "",
        dashed: "border-dashed",
        filled: "",
        text: "border-transparent bg-transparent shadow-none",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        small:
          "h-8 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        middle:
          "h-9 gap-1.5 px-3 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        large:
          "h-10 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
      },
      shape: {
        default: "rounded-md",
        round: "rounded-full",
        circle: "rounded-full px-0",
        square: "rounded-md px-0",
      },
      block: {
        true: "w-full",
        false: "",
      },
      ghost: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      color: "default",
      variant: "outlined",
      size: "middle",
      shape: "default",
      block: false,
      ghost: false,
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "default",
        className: "border-transparent bg-foreground text-background hover:bg-foreground/85",
      },
      {
        variant: "solid",
        color: "primary",
        className: "border-transparent bg-primary text-primary-foreground hover:bg-primary/85",
      },
      {
        variant: "solid",
        color: "danger",
        className:
          "border-transparent bg-destructive text-white hover:bg-destructive/85 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      },
      {
        variant: "solid",
        color: "success",
        className: "border-transparent bg-emerald-600 text-white hover:bg-emerald-600/85",
      },
      {
        variant: "solid",
        color: "warning",
        className: "border-transparent bg-amber-500 text-white hover:bg-amber-500/85",
      },
      {
        variant: "solid",
        color: "info",
        className: "border-transparent bg-sky-600 text-white hover:bg-sky-600/85",
      },
      {
        variant: ["outlined", "dashed"],
        color: "default",
        className:
          "border-border bg-background text-foreground shadow-xs hover:border-foreground/30 hover:bg-muted aria-expanded:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
      },
      {
        variant: ["outlined", "dashed"],
        color: "primary",
        className:
          "border-primary/60 bg-background text-primary shadow-xs hover:border-primary hover:bg-primary/10",
      },
      {
        variant: ["outlined", "dashed"],
        color: "danger",
        className:
          "border-destructive/50 bg-background text-destructive shadow-xs hover:border-destructive hover:bg-destructive/10 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
      },
      {
        variant: ["outlined", "dashed"],
        color: "success",
        className:
          "border-emerald-600/50 bg-background text-emerald-700 shadow-xs hover:border-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
      },
      {
        variant: ["outlined", "dashed"],
        color: "warning",
        className:
          "border-amber-500/60 bg-background text-amber-700 shadow-xs hover:border-amber-500 hover:bg-amber-500/10 dark:text-amber-400",
      },
      {
        variant: ["outlined", "dashed"],
        color: "info",
        className:
          "border-sky-600/50 bg-background text-sky-700 shadow-xs hover:border-sky-600 hover:bg-sky-500/10 dark:text-sky-400",
      },
      {
        variant: "filled",
        color: "default",
        className: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      {
        variant: "filled",
        color: "primary",
        className: "border-transparent bg-primary/10 text-primary hover:bg-primary/15",
      },
      {
        variant: "filled",
        color: "danger",
        className:
          "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
      },
      {
        variant: "filled",
        color: "success",
        className: "border-transparent bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400",
      },
      {
        variant: "filled",
        color: "warning",
        className: "border-transparent bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400",
      },
      {
        variant: "filled",
        color: "info",
        className: "border-transparent bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:text-sky-400",
      },
      {
        variant: ["text", "link"],
        color: "default",
        className: "text-foreground hover:bg-muted aria-expanded:bg-muted dark:hover:bg-muted/50",
      },
      {
        variant: ["text", "link"],
        color: "primary",
        className: "text-primary hover:bg-primary/10",
      },
      {
        variant: ["text", "link"],
        color: "danger",
        className: "text-destructive hover:bg-destructive/10",
      },
      {
        variant: ["text", "link"],
        color: "success",
        className: "text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
      },
      {
        variant: ["text", "link"],
        color: "warning",
        className: "text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
      },
      {
        variant: ["text", "link"],
        color: "info",
        className: "text-sky-700 hover:bg-sky-500/10 dark:text-sky-400",
      },
      {
        ghost: true,
        variant: ["solid", "outlined", "dashed", "filled"],
        className: "bg-transparent hover:bg-transparent",
      },
      {
        shape: ["circle", "square"],
        size: "small",
        className: "size-8",
      },
      {
        shape: ["circle", "square"],
        size: "middle",
        className: "size-9",
      },
      {
        shape: ["circle", "square"],
        size: "large",
        className: "size-10",
      },
    ],
  }
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
type ButtonColor = NonNullable<VariantProps<typeof buttonVariants>["color"]>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>
type ButtonShape = NonNullable<VariantProps<typeof buttonVariants>["shape"]>

export {
  buttonVariants,
  type ButtonColor,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
}
