import { cva, type VariantProps } from "class-variance-authority";

const floatButtonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center border transition-all hover:shadow active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      type: {
        default: "border-border bg-background text-foreground shadow hover:bg-muted",
        primary: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
      },
      size: {
        default: "h-12 min-w-12 px-3 text-sm [&_svg:not([class*='size-'])]:size-5",
        sm: "h-9 min-w-9 px-2 text-xs [&_svg:not([class*='size-'])]:size-4",
        lg: "h-14 min-w-14 px-4 text-sm [&_svg:not([class*='size-'])]:size-6",
      },
      shape: {
        circle: "rounded-full px-0",
        square: "rounded",
      },
      iconOnly: {
        true: "px-0",
        false: "gap-1.5",
      },
    },
    defaultVariants: {
      type: "default",
      size: "default",
      shape: "circle",
      iconOnly: true,
    },
  }
);

type FloatButtonType = NonNullable<VariantProps<typeof floatButtonVariants>["type"]>;
type FloatButtonSize = NonNullable<VariantProps<typeof floatButtonVariants>["size"]>;
type FloatButtonShape = NonNullable<VariantProps<typeof floatButtonVariants>["shape"]>;

export { floatButtonVariants, type FloatButtonShape, type FloatButtonSize, type FloatButtonType };
