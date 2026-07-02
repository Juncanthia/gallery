import * as React from "react";
import { type CSSProperties, type ReactNode, useEffect } from "react";
import { useMotionValue, animate, useTransform, motion } from "motion/react";
import { cn } from "@/_internals/foundations/utils/cn";

interface AnimatedNumberProps {
  value: number;
  precision?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  className?: string;
}

function formatNumber(
  value: number,
  precision?: number,
  decimalSeparator = ".",
  groupSeparator = ","
) {
  const fixed = precision !== undefined ? value.toFixed(precision) : Math.round(value).toString();
  const [integer = "", decimal] = fixed.split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

  return decimal !== undefined
    ? `${formattedInteger}${decimalSeparator}${decimal}`
    : formattedInteger;
}

function AnimatedNumber({
  value,
  precision,
  decimalSeparator,
  groupSeparator,
  className,
}: AnimatedNumberProps) {
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [motionVal, value]);

  const displayText = useTransform(motionVal, (v) => {
    return formatNumber(v, precision, decimalSeparator, groupSeparator);
  });

  return <motion.span className={className}>{displayText}</motion.span>;
}

interface StatisticProps {
  title?: ReactNode;
  value?: number | string | ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  formatter?: (value: number | string) => ReactNode;
  valueRender?: (node: ReactNode) => ReactNode;
  decimalSeparator?: string;
  groupSeparator?: string;
  valueStyle?: CSSProperties;
  valueClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
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
  valueRender,
  decimalSeparator = ".",
  groupSeparator = ",",
  valueStyle,
  valueClassName,
  titleClassName,
  contentClassName,
  loading,
  className,
}: StatisticProps) {
  const mergedValue = value ?? 0;
  const isNumeric = !loading && typeof mergedValue === "number" && !formatter;

  let displayValue: ReactNode = mergedValue;

  if (loading) {
    displayValue = <div className="h-8 w-24 animate-pulse rounded bg-muted" />;
  } else if (formatter && (typeof mergedValue === "number" || typeof mergedValue === "string")) {
    displayValue = formatter(mergedValue);
  } else if (!isNumeric && precision !== undefined && typeof mergedValue === "number") {
    displayValue = formatNumber(mergedValue, precision, decimalSeparator, groupSeparator);
  }

  const valueNode = isNumeric ? (
    <AnimatedNumber
      value={mergedValue as number}
      precision={precision}
      decimalSeparator={decimalSeparator}
      groupSeparator={groupSeparator}
    />
  ) : (
    displayValue
  );

  return (
    <div data-slot="statistic" className={cn("", className)}>
      {title && (
        <div
          data-slot="statistic-title"
          className={cn("text-sm font-medium text-muted-foreground", titleClassName)}
        >
          {title}
        </div>
      )}
      <div
        data-slot="statistic-content"
        className={cn("flex items-baseline gap-1", contentClassName)}
      >
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
            valueClassName
          )}
          style={valueStyle}
        >
          {valueRender ? valueRender(valueNode) : valueNode}
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

type StatisticTimerType = "countdown" | "countup";

interface StatisticTimerProps extends Omit<StatisticProps, "value" | "formatter" | "valueRender"> {
  value?: number | string | Date;
  type?: StatisticTimerType;
  format?: string;
  onFinish?: () => void;
  onChange?: (value: number) => void;
}

function getTimestamp(value?: number | string | Date) {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string") {
    return new Date(value).getTime();
  }

  return value ?? Date.now();
}

function padTime(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

function formatDuration(value: number, format: string) {
  const total = Math.max(0, Math.floor(value / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return format
    .replace(/DD/g, padTime(days))
    .replace(/D/g, String(days))
    .replace(/HH/g, padTime(hours))
    .replace(/H/g, String(hours))
    .replace(/mm/g, padTime(minutes))
    .replace(/m/g, String(minutes))
    .replace(/ss/g, padTime(seconds))
    .replace(/s/g, String(seconds));
}

function StatisticTimer({
  value,
  type = "countdown",
  format = "HH:mm:ss",
  onFinish,
  onChange,
  ...props
}: StatisticTimerProps) {
  const [now, setNow] = React.useState(() => Date.now());
  const finishedRef = React.useRef(false);
  const timestamp = getTimestamp(value);
  const diff = type === "countdown" ? timestamp - now : now - timestamp;
  const safeDiff = Math.max(0, diff);

  useEffect(() => {
    finishedRef.current = false;
  }, [timestamp, type]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    onChange?.(safeDiff);

    if (type === "countdown" && diff <= 0 && !finishedRef.current) {
      finishedRef.current = true;
      onFinish?.();
    }
  }, [diff, onChange, onFinish, safeDiff, type]);

  return <Statistic {...props} value={formatDuration(safeDiff, format)} />;
}

export { Statistic, StatisticDiff, StatisticTimer };
export type { StatisticProps, StatisticDiffProps, StatisticTimerProps, StatisticTimerType };
