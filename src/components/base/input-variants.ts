import { cva, type VariantProps } from "class-variance-authority"

const inputRootVariants = cva(
  "w-full min-w-0 border text-base transition-[color,box-shadow,background-color,border-color] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        outlined:
          "rounded-md border-input bg-transparent shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
        filled:
          "rounded-md border-transparent bg-muted/60 shadow-none hover:bg-muted focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/50",
        borderless:
          "rounded-md border-transparent bg-transparent shadow-none focus-visible:ring-0",
        underlined:
          "rounded-none border-x-0 border-t-0 border-b-input bg-transparent px-0 shadow-none focus-visible:border-b-ring focus-visible:ring-0",
        skeuomorphic:
          "rounded border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.3)] focus-visible:border-blue-500 focus-visible:ring-blue-500/20 focus-visible:bg-white dark:focus-visible:bg-zinc-950",
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

const inputAffixWrapperVariants = cva(
  "group/input relative inline-flex w-full min-w-0 items-center border text-base transition-[color,box-shadow,background-color,border-color] outline-none has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 md:text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        outlined:
          "rounded-md border-input bg-transparent shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        filled:
          "rounded-md border-transparent bg-muted/60 shadow-none hover:bg-muted focus-within:border-ring focus-within:bg-background focus-within:ring-3 focus-within:ring-ring/50",
        borderless:
          "rounded-md border-transparent bg-transparent shadow-none focus-within:ring-0",
        underlined:
          "rounded-none border-x-0 border-t-0 border-b-input bg-transparent px-0 shadow-none focus-within:border-b-ring focus-within:ring-0",
        skeuomorphic:
          "rounded border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.3)] focus-within:border-blue-500 focus-within:ring-blue-500/20 focus-within:bg-white dark:focus-within:bg-zinc-950",
      },
      size: {
        small: "h-8 gap-1 px-2 text-xs",
        middle: "h-9 gap-1.5 px-2.5",
        large: "h-10 gap-1.5 px-3 text-sm",
      },
      status: {
        default: "",
        error:
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:border-destructive/50 dark:focus-within:ring-destructive/40",
        warning:
          "border-amber-500 focus-within:border-amber-500 focus-within:ring-amber-500/20 dark:focus-within:ring-amber-500/30",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "middle",
      status: "default",
    },
  }
)

const inputElementVariants = cva(
  "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
  {
    variants: {
      size: {
        small: "text-xs",
        middle: "text-base md:text-sm",
        large: "text-sm",
      },
    },
    defaultVariants: {
      size: "middle",
    },
  }
)

const textareaVariants = cva(
  "field-sizing-content w-full min-w-0 border text-base transition-[color,box-shadow,background-color,border-color] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        outlined:
          "rounded-md border-input bg-transparent shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
        filled:
          "rounded-md border-transparent bg-muted/60 shadow-none hover:bg-muted focus-visible:border-ring focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/50",
        borderless:
          "rounded-md border-transparent bg-transparent shadow-none focus-visible:ring-0",
        underlined:
          "rounded-none border-x-0 border-t-0 border-b-input bg-transparent px-0 shadow-none focus-visible:border-b-ring focus-visible:ring-0",
        skeuomorphic:
          "rounded border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.3)] focus-visible:border-blue-500 focus-visible:ring-blue-500/20 focus-visible:bg-white dark:focus-visible:bg-zinc-950",
      },
      size: {
        small: "min-h-14 px-2 py-1.5 text-xs",
        middle: "min-h-16 px-2.5 py-2",
        large: "min-h-20 px-3 py-2.5 text-sm",
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

type InputVariant = NonNullable<VariantProps<typeof inputRootVariants>["variant"]>
type InputSize = NonNullable<VariantProps<typeof inputRootVariants>["size"]>
type InputStatus = Exclude<
  NonNullable<VariantProps<typeof inputRootVariants>["status"]>,
  "default"
>

export {
  inputAffixWrapperVariants,
  inputElementVariants,
  inputRootVariants,
  textareaVariants,
  type InputSize,
  type InputStatus,
  type InputVariant,
}
