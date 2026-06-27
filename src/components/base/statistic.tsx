import { type ReactNode, useEffect } from "react";
import { useMotionValue, animate, useTransform, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  precision?: number;
  className?: string;
}

function AnimatedNumber({ value, precision, className }: AnimatedNumberProps) {
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [motionVal, value]);

  const displayText = useTransform(motionVal, (v) => {
    if (precision !== undefined) return v.toFixed(precision);
    return Math.round(v).toLocaleString("en-US");
  });

  return <motion.span className={className}>{displayText}</motion.span>;
}

interface StatisticProps {
  title?: ReactNode;
  value: number | string | ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  formatter?: (value: number | string) => ReactNode;
  valueStyle?: string;
  loading?: boolean;
  className?: string;
}

function Statistic({
  title,
  value,
  prefix,
  suffix,
  precision,
  formatter,
  valueStyle,
  loading,
  className,
}: StatisticProps) {
  const isNumeric = !loading && typeof value === "number" && !formatter;

  let displayValue: ReactNode = value;

  if (loading) {
    displayValue = <div className="h-8 w-24 animate-pulse rounded bg-muted" />;
  } else if (formatter && typeof value === "number") {
    displayValue = formatter(value);
  } else if (!isNumeric && precision !== undefined && typeof value === "number") {
    displayValue = value.toFixed(precision);
  }

  return (
    <div data-slot="statistic" className={cn("", className)}>
      {title && (
        <div
          data-slot="statistic-title"
          className="text-sm font-medium text-muted-foreground"
        >
          {title}
        </div>
      )}
      <div data-slot="statistic-content" className="flex items-baseline gap-1">
        {prefix && (
          <span
            data-slot="statistic-prefix"
            className="text-2xl text-foreground"
          >
            {prefix}
          </span>
        )}
        <span
          data-slot="statistic-value"
          className={cn(
            "text-3xl font-semibold tabular-nums text-foreground",
            valueStyle
          )}
        >
          {isNumeric ? (
            <AnimatedNumber value={value as number} precision={precision} />
          ) : (
            displayValue
          )}
        </span>
        {suffix && (
          <span
            data-slot="statistic-suffix"
            className="text-base text-muted-foreground"
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface StatisticDiffProps {
  value: number;
  className?: string;
}

function StatisticDiff({ value, className }: StatisticDiffProps) {
  const isPositive = value >= 0;
  const colorClass = isPositive
    ? "text-green-600 dark:text-green-500"
    : "text-destructive";

  return (
    <span data-slot="statistic-diff" className={cn(colorClass, className)}>
      {isPositive && "+"}
      {value}%
    </span>
  );
}

export { Statistic, StatisticDiff };
export type { StatisticProps, StatisticDiffProps };
