import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      col: "flex-col",
      "col-reverse": "flex-col-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
    },
    inline: {
      true: "inline-flex",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "start",
    wrap: "nowrap",
  },
  compoundVariants: [
    {
      inline: true,
      className: "inline-flex",
    },
  ],
});

interface FlexProps extends VariantProps<typeof flexVariants> {
  children: ReactNode;
  className?: string;
}

function Flex({
  children,
  className,
  direction,
  align,
  justify,
  wrap,
  gap,
  inline,
}: FlexProps) {
  return (
    <div
      data-slot="flex"
      className={cn(
        flexVariants({ direction, align, justify, wrap, gap, inline }),
        className
      )}
    >
      {children}
    </div>
  );
}

export { Flex, flexVariants };
export type { FlexProps };
