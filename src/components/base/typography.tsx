import * as React from "react";
import { Check, Copy } from "lucide-react";
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

type TypographyType = "secondary" | "success" | "warning" | "danger"

const typographyTypeClasses: Record<"default" | "secondary" | "success" | "warning" | "danger" | "disabled", string> = {
  default: "text-foreground",
  secondary: "text-muted-foreground",
  success: "text-green-600 dark:text-green-500",
  warning: "text-yellow-600 dark:text-yellow-500",
  danger: "text-destructive",
  disabled: "text-muted-foreground opacity-50",
};
type CopyableConfig = {
  text?: string | (() => string | Promise<string>);
  onCopy?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode | [React.ReactNode, React.ReactNode];
  tooltips?: React.ReactNode | [React.ReactNode, React.ReactNode] | false;
  tabIndex?: number;
}
type EllipsisConfig = {
  rows?: number;
  tooltip?: boolean | React.ReactNode;
  expandable?: boolean | "collapsible";
  suffix?: React.ReactNode;
  symbol?: React.ReactNode | ((expanded: boolean) => React.ReactNode);
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpand?: (event: React.MouseEvent<HTMLElement>, info: { expanded: boolean }) => void;
}

type TextProps = Omit<React.ComponentProps<"span">, "color"> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean;
    type?: TypographyType;
    disabled?: boolean;
    underline?: boolean;
    italic?: boolean;
    del?: boolean;
    delete?: boolean;
    mark?: boolean;
    code?: boolean;
    keyboard?: boolean;
    strong?: boolean;
    copyable?: boolean | CopyableConfig;
    ellipsis?: boolean | EllipsisConfig;
  }

function getVariant(variant: TextProps["variant"], type?: TypographyType, disabled?: boolean) {
  if (disabled) {
    return "disabled";
  }

  return type ?? variant;
}

function getTypeClass(type?: TypographyType, disabled?: boolean) {
  return typographyTypeClasses[getVariant("default", type, disabled) ?? "default"];
}

function getTextFromNode(node: React.ReactNode) {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  return "";
}

function toTuple<T>(value: T | [T, T] | undefined): [T | undefined, T | undefined] {
  return Array.isArray(value) ? value : [value, value];
}

function getEllipsisStyle(ellipsis?: boolean | EllipsisConfig, expanded?: boolean): React.CSSProperties | undefined {
  if (!ellipsis || expanded) {
    return undefined;
  }

  if (typeof ellipsis === "object" && ellipsis.rows && ellipsis.rows > 1) {
    return {
      display: "-webkit-box",
      WebkitLineClamp: ellipsis.rows,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    };
  }

  return undefined;
}

function useEllipsisState(ellipsis?: boolean | EllipsisConfig) {
  const config = typeof ellipsis === "object" ? ellipsis : undefined;
  const [innerExpanded, setInnerExpanded] = React.useState(config?.defaultExpanded ?? false);
  const expanded = config?.expanded ?? innerExpanded;

  const onToggle = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    const nextExpanded = config?.expandable === "collapsible" ? !expanded : true;

    if (config?.expanded === undefined) {
      setInnerExpanded(nextExpanded);
    }

    config?.onExpand?.(event, { expanded: nextExpanded });
  }, [config, expanded]);

  return { config, expanded, onToggle };
}

function EllipsisAction({
  config,
  expanded,
  onToggle,
}: {
  config?: EllipsisConfig;
  expanded: boolean;
  onToggle: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  if (!config?.expandable) {
    return null;
  }

  const symbol = typeof config.symbol === "function" ? config.symbol(expanded) : config.symbol ?? (expanded ? "Collapse" : "More");

  return (
    <button
      type="button"
      className="ml-1 inline-flex items-center rounded px-1 text-primary underline-offset-4 hover:underline"
      onClick={onToggle}
    >
      {symbol}
    </button>
  );
}

function renderEllipsisChildren(
  children: React.ReactNode,
  ellipsisState: ReturnType<typeof useEllipsisState>
) {
  const suffix = ellipsisState.config?.suffix;

  if (!ellipsisState.config?.expandable && suffix === undefined) {
    return children;
  }

  return (
    <>
      {children}
      {!ellipsisState.expanded && suffix !== undefined ? suffix : null}
      <EllipsisAction {...ellipsisState} />
    </>
  );
}

function useCopyable(copyable: TextProps["copyable"], children: React.ReactNode) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    const config = typeof copyable === "object" ? copyable : undefined;
    const rawText = config?.text;
    const text = typeof rawText === "function" ? await rawText() : rawText ?? getTextFromNode(children);

    if (text) {
      await globalThis.navigator?.clipboard?.writeText(text);
    }

    setCopied(true);
    globalThis.setTimeout(() => setCopied(false), 1200);
  }, [children, copyable]);

  return { copied, copy };
}

function CopyAction({ copyable, children }: { copyable: TextProps["copyable"]; children: React.ReactNode }) {
  const { copied, copy } = useCopyable(copyable, children);
  const config = typeof copyable === "object" ? copyable : undefined;
  const iconNodes = toTuple(config?.icon);
  const tooltipNodes = toTuple(config?.tooltips === false ? undefined : config?.tooltips);
  const title = tooltipNodes[copied ? 1 : 0];
  const ariaLabel = typeof title === "string" ? title : copied ? "Copied" : "Copy";

  return (
    <button
      type="button"
      className="ml-1 inline-flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={ariaLabel}
      title={typeof title === "string" ? title : undefined}
      tabIndex={config?.tabIndex}
      onClick={(event) => {
        void copy();
        config?.onCopy?.(event);
      }}
    >
      {copied ? iconNodes[1] ?? <Check className="size-3" /> : iconNodes[0] ?? <Copy className="size-3" />}
    </button>
  );
}

function Text({
  children,
  className,
  variant,
  type,
  disabled,
  size,
  weight,
  asChild,
  underline,
  italic,
  del,
  delete: deleteText,
  mark,
  code,
  keyboard,
  strong,
  copyable,
  ellipsis,
  style,
  ...props
}: TextProps) {
  const Component = asChild ? Slot.Root : "span";
  const ellipsisState = useEllipsisState(ellipsis);
  const content = (
    <Component
      data-slot="text"
      aria-disabled={disabled || undefined}
      className={cn(
        textVariants({ variant: getVariant(variant, type, disabled), size, weight: strong ? "semibold" : weight }),
        underline && "underline underline-offset-4",
        italic && "italic",
        (del || deleteText) && "line-through",
        mark && "rounded-sm bg-yellow-200 px-0.5 dark:bg-yellow-900/40",
        code && "rounded bg-muted px-1 py-0.5 font-mono text-[0.875em]",
        keyboard && "rounded border bg-muted px-1 py-0.5 font-mono text-[0.875em] shadow-xs",
        ellipsis && "inline-block max-w-full align-bottom",
        ellipsis === true && "truncate",
        disabled && "pointer-events-none select-none",
        className
      )}
      style={{ ...getEllipsisStyle(ellipsis, ellipsisState.expanded), ...style }}
      {...props}
    >
      {renderEllipsisChildren(children, ellipsisState)}
    </Component>
  );

  if (!copyable) {
    return content;
  }

  return (
    <span data-slot="text-copyable" className="inline-flex max-w-full items-center align-bottom">
      {content}
      <CopyAction copyable={copyable}>
        {children}
      </CopyAction>
    </span>
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

type TitleProps = Omit<React.ComponentProps<"h1">, "color"> &
  VariantProps<typeof titleVariants> & {
    type?: TypographyType;
    disabled?: boolean;
    copyable?: boolean | CopyableConfig;
    ellipsis?: boolean | EllipsisConfig;
  }

function Title({ children, level = 1, className, type, disabled, copyable, ellipsis, style, ...props }: TitleProps) {
  const tagMap = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5" } as const;
  const Component = tagMap[level ?? 1];
  const ellipsisState = useEllipsisState(ellipsis);
  const content = (
    <Component
      data-slot="title"
      aria-disabled={disabled || undefined}
      className={cn(
        titleVariants({ level }),
        getTypeClass(type, disabled),
        ellipsis === true && "truncate",
        disabled && "pointer-events-none select-none",
        className
      )}
      style={{ ...getEllipsisStyle(ellipsis, ellipsisState.expanded), ...style }}
      {...props}
    >
      {renderEllipsisChildren(children, ellipsisState)}
    </Component>
  );

  if (!copyable) {
    return content;
  }

  return (
    <div data-slot="title-copyable" className="inline-flex max-w-full items-center gap-1">
      {content}
      <CopyAction copyable={copyable}>{children}</CopyAction>
    </div>
  );
}

type ParagraphProps = Omit<React.ComponentProps<"p">, "color"> & {
  type?: TypographyType;
  disabled?: boolean;
  copyable?: boolean | CopyableConfig;
  ellipsis?: boolean | EllipsisConfig;
  strong?: boolean;
}

function Paragraph({ children, className, type, disabled, copyable, ellipsis, strong, style, ...props }: ParagraphProps) {
  const ellipsisState = useEllipsisState(ellipsis);
  const content = (
    <p
      data-slot="paragraph"
      aria-disabled={disabled || undefined}
      className={cn(
        "text-sm leading-relaxed [&:not(:first-child)]:mt-4",
        getTypeClass(type, disabled),
        strong && "font-semibold",
        ellipsis === true && "truncate",
        disabled && "pointer-events-none select-none",
        className
      )}
      style={{ ...getEllipsisStyle(ellipsis, ellipsisState.expanded), ...style }}
      {...props}
    >
      {renderEllipsisChildren(children, ellipsisState)}
    </p>
  );

  if (!copyable) {
    return content;
  }

  return (
    <div data-slot="paragraph-copyable" className="inline-flex max-w-full items-start gap-1">
      {content}
      <CopyAction copyable={copyable}>{children}</CopyAction>
    </div>
  );
}

type LinkProps = React.ComponentProps<"a"> & {
  disabled?: boolean;
}

function Link({ children, href, className, disabled, ...props }: LinkProps) {
  return (
    <a
      data-slot="link"
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      className={cn(
        "text-primary underline underline-offset-4 transition-colors hover:text-primary/80",
        disabled && "pointer-events-none text-muted-foreground opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export { Text, Title, Paragraph, Link };
export type { TextProps, TitleProps, ParagraphProps, LinkProps, CopyableConfig, EllipsisConfig, TypographyType };
