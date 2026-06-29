import { cva, type VariantProps } from "class-variance-authority"

const selectTriggerVariants = cva(
  "group/select inline-flex w-full min-w-0 items-center justify-between gap-1.5 border text-base whitespace-nowrap transition-[color,box-shadow,background-color,border-color] outline-none select-none data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        outlined:
          "rounded-md border-input bg-transparent shadow-xs data-popup-open:bg-muted dark:bg-input/30 dark:data-popup-open:bg-input/50",
        filled:
          "rounded-md border-transparent bg-muted/60 shadow-none hover:bg-muted data-popup-open:bg-muted focus-visible:bg-background",
        borderless:
          "rounded-md border-transparent bg-transparent shadow-none focus-visible:ring-0",
        underlined:
          "rounded-none border-x-0 border-t-0 border-b-input bg-transparent px-0 shadow-none focus-visible:border-b-ring focus-visible:ring-0",
        skeuomorphic:
          "rounded border-neutral-300 dark:border-zinc-700 bg-linear-to-b from-white to-neutral-50 dark:from-zinc-800 dark:to-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] focus-visible:border-blue-500 focus-visible:ring-blue-500/20 hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-zinc-750 dark:hover:to-zinc-850 active:translate-y-[0.5px] transition-all duration-100",
      },
      size: {
        small: "h-8 px-2 text-xs",
        middle: "h-9 px-2.5",
        large: "h-10 px-3 text-sm",
      },
      status: {
        default: "",
        error:
          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:border-destructive/50 dark:focus-visible:ring-destructive/40",
        warning:
          "border-amber-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-500/30",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "middle",
      status: "default",
    },
  }
)

const selectInputVariants = cva(
  "w-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        small: "h-8 text-xs",
        middle: "h-9 text-base md:text-sm",
        large: "h-10 text-sm",
      },
    },
    defaultVariants: {
      size: "middle",
    },
  }
)

const selectPopupVariants = cva(
  "relative z-50 max-h-[min(18rem,var(--available-height))] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
)

const selectItemVariants = cva(
  "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-accent/60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
)

const selectChipVariants = cva(
  "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-data-[slot=select-chip-remove]:pr-0"
)

type SelectVariant = NonNullable<VariantProps<typeof selectTriggerVariants>["variant"]>
type SelectSize = NonNullable<VariantProps<typeof selectTriggerVariants>["size"]>
type SelectStatus = Exclude<
  NonNullable<VariantProps<typeof selectTriggerVariants>["status"]>,
  "default"
>

export {
  selectChipVariants,
  selectInputVariants,
  selectItemVariants,
  selectPopupVariants,
  selectTriggerVariants,
  type SelectSize,
  type SelectStatus,
  type SelectVariant,
}
