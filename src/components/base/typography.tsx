import { type ReactNode } from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      secondary: "text-muted-foreground",
      success: "text-green-600 dark:text-green-500",
      warning: "text-yellow-600 dark:text-yellow-500",
      danger: "text-destructive",
      disabled: "text-muted-foreground opacity-50",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
    weight: "normal",
  },
});

interface TextProps extends VariantProps<typeof textVariants> {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  underline?: boolean;
  italic?: boolean;
  del?: boolean;
  mark?: boolean;
  code?: boolean;
  ellipsis?: boolean;
}

function Text({
  children,
  className,
  variant,
  size,
  weight,
  asChild,
  underline,
  italic,
  del,
  mark,
  code,
  ellipsis,
}: TextProps) {
  const Component = asChild ? Slot.Root : "span";

  return (
    <Component
      data-slot="text"
      className={cn(
        textVariants({ variant, size, weight }),
        underline && "underline underline-offset-4",
        italic && "italic",
        del && "line-through",
        mark && "bg-yellow-200 dark:bg-yellow-900/40 rounded-sm px-0.5",
        code && "font-mono bg-muted rounded px-1 py-0.5 text-[0.875em]",
        ellipsis && "truncate",
        className
      )}
    >
      {children}
    </Component>
  );
}

const titleVariants = cva("scroll-m-20 font-semibold tracking-tight", {
  variants: {
    level: {
      1: "text-4xl",
      2: "text-3xl",
      3: "text-2xl",
      4: "text-xl",
      5: "text-lg",
    },
  },
  defaultVariants: {
    level: 1,
  },
});

interface TitleProps extends VariantProps<typeof titleVariants> {
  children: ReactNode;
  className?: string;
}

function Title({ children, level = 1, className }: TitleProps) {
  const tagMap = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5" } as const;
  const Component = tagMap[level ?? 1];

  return (
    <Component
      data-slot="title"
      className={cn(titleVariants({ level }), className)}
    >
      {children}
    </Component>
  );
}

interface ParagraphProps {
  children: ReactNode;
  className?: string;
}

function Paragraph({ children, className }: ParagraphProps) {
  return (
    <p
      data-slot="paragraph"
      className={cn(
        "text-sm leading-relaxed text-foreground [&:not(:first-child)]:mt-4",
        className
      )}
    >
      {children}
    </p>
  );
}

interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

function Link({ children, href, className }: LinkProps) {
  return (
    <a
      data-slot="link"
      href={href}
      className={cn(
        "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors",
        className
      )}
    >
      {children}
    </a>
  );
}

export { Text, Title, Paragraph, Link };
export type { TextProps, TitleProps, ParagraphProps, LinkProps };
