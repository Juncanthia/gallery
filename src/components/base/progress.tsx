import type * as React from 'react';

import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
  type ProgressProps as ProgressPrimitiveProps,
} from '@/primitives/radix/progress';
import { cn } from '@/lib/utils';

type ProgressStatus = 'normal' | 'exception' | 'active' | 'success';

type ProgressProps = ProgressPrimitiveProps & {
  indicatorClassName?: string;
  percent?: number;
  showInfo?: boolean;
  format?: (percent: number) => React.ReactNode;
  status?: ProgressStatus;
  strokeColor?: string;
  railColor?: string;
  size?: 'small' | 'default' | 'large' | number;
};

const progressStatusClassName: Record<ProgressStatus, string> = {
  normal: 'bg-primary',
  active: 'bg-primary',
  success: 'bg-green-500',
  exception: 'bg-destructive',
};

function Progress({
  className,
  indicatorClassName,
  percent,
  value,
  showInfo = false,
  format,
  status,
  strokeColor,
  railColor,
  size,
  style,
  ...props
}: ProgressProps) {
  const mergedValue = Math.max(0, Math.min(100, percent ?? value ?? 0));
  const mergedStatus = status ?? (mergedValue >= 100 ? 'success' : 'normal');
  const height =
    typeof size === 'number'
      ? size
      : size === 'large'
        ? 12
        : size === 'small'
          ? 6
          : undefined;
  const info = format ? format(mergedValue) : `${mergedValue}%`;
  const progressNode = (
    <ProgressPrimitive
      className={cn(
        'relative h-2 w-full flex-1 overflow-hidden rounded-full bg-primary/20',
        !showInfo && className,
      )}
      style={{ backgroundColor: railColor, height, ...style }}
      value={mergedValue}
      {...props}
    >
      <ProgressIndicatorPrimitive
        className={cn(
          'h-full w-full flex-1',
          progressStatusClassName[mergedStatus],
          mergedStatus === 'active' && 'animate-pulse',
          indicatorClassName,
        )}
        style={{ backgroundColor: strokeColor }}
      />
    </ProgressPrimitive>
  );

  if (!showInfo) {
    return progressNode;
  }

  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      {progressNode}
      {showInfo && (
        <span className="min-w-9 text-right text-xs tabular-nums text-muted-foreground">
          {info}
        </span>
      )}
    </div>
  );
}

export { Progress, type ProgressProps, type ProgressStatus };
