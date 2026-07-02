import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      size: {
        default: "h-5",
        sm: "h-4 px-1.5 text-[10px]",
        small: "h-4 px-1.5 text-[10px]",
        lg: "h-6 px-2.5 text-sm",
        large: "h-6 px-2.5 text-sm",
      },
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        muted:
          "border-transparent bg-muted text-muted-foreground [a]:hover:bg-muted/80",
        success:
          "border-emerald-500 bg-transparent text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 [a]:hover:bg-emerald-500/10",
        info:
          "border-sky-500 bg-transparent text-sky-600 dark:border-sky-400 dark:text-sky-400 [a]:hover:bg-sky-500/10",
        warning:
          "border-amber-500 bg-transparent text-amber-500 dark:border-amber-400 dark:text-amber-400 [a]:hover:bg-amber-500/10",
        error:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>
type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>

export { badgeVariants, type BadgeSize, type BadgeVariant }
