import type * as React from 'react';

import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
  type ProgressProps as ProgressPrimitiveProps,
} from '@/primitives/radix/progress';
import { cn } from '@/lib/utils';

type ProgressStatus = 'normal' | 'exception' | 'active' | 'success';
type ProgressType = 'line' | 'circle' | 'dashboard';
type ProgressSize = 'small' | 'default' | 'middle' | 'large';
type ProgressGradient =
  | { from: string; to: string; direction?: string }
  | ({ direction?: string } & Record<string, string>);
type ProgressPercentPosition = {
  align?: 'start' | 'center' | 'end';
  type?: 'inner' | 'outer';
};
type ProgressSuccess = {
  percent?: number;
  strokeColor?: string;
};

type ProgressProps = Omit<ProgressPrimitiveProps, 'children'> & {
  indicatorClassName?: string;
  percent?: number;
  showInfo?: boolean;
  format?: (percent: number, successPercent?: number) => React.ReactNode;
  status?: ProgressStatus;
  type?: ProgressType;
  strokeColor?: string | string[] | ProgressGradient;
  railColor?: string;
  trailColor?: string;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'square' | 'round';
  size?: ProgressSize | number | [number | string, number] | { width?: number; height?: number };
  steps?: number | { count: number; gap?: number };
  success?: ProgressSuccess;
  percentPosition?: ProgressPercentPosition;
  gapDegree?: number;
  children?: React.ReactNode;
};

const progressStatusClassName: Record<ProgressStatus, string> = {
  normal: 'bg-primary',
  active: 'bg-primary',
  success: 'bg-green-500',
  exception: 'bg-destructive',
};

const progressStatusColor: Record<ProgressStatus, string> = {
  normal: 'var(--primary)',
  active: 'var(--primary)',
  success: '#22c55e',
  exception: 'var(--destructive)',
};

function clampPercent(value: number | undefined) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value ?? 0));
}

function getLineHeight(size: ProgressProps['size'], strokeWidth?: number) {
  if (strokeWidth !== undefined) return strokeWidth;
  if (typeof size === 'number') return size;
  if (Array.isArray(size)) return size[1];
  if (typeof size === 'object') return size.height;
  if (size === 'large') return 12;
  if (size === 'small') return 6;
  return undefined;
}

function getCircleSize(size: ProgressProps['size']) {
  if (typeof size === 'number') return size;
  if (typeof size === 'object' && !Array.isArray(size)) return size.width ?? size.height ?? 120;
  if (size === 'large') return 160;
  if (size === 'small') return 80;
  return 120;
}

function getLineWidth(size: ProgressProps['size']) {
  if (Array.isArray(size)) return size[0];
  if (typeof size === 'object' && !Array.isArray(size)) return size.width;
  return undefined;
}

function getGradientStyle(strokeColor: ProgressProps['strokeColor']) {
  if (!strokeColor) return undefined;
  if (typeof strokeColor === 'string') return { background: strokeColor };
  if (Array.isArray(strokeColor)) {
    return { background: `linear-gradient(to right, ${strokeColor.join(', ')})` };
  }

  const { direction = 'to right', from, to, ...stops } = strokeColor as {
    direction?: string;
    from?: string;
    to?: string;
  } & Record<string, string | undefined>;

  if (from && to) {
    return { background: `linear-gradient(${direction}, ${from}, ${to})` };
  }

  const sortedStops = Object.entries(stops)
    .filter(([key, value]) => key.endsWith('%') && value)
    .sort(([a], [b]) => Number.parseFloat(a) - Number.parseFloat(b))
    .map(([key, value]) => `${value} ${key}`)
    .join(', ');

  return sortedStops
    ? { background: `linear-gradient(${direction}, ${sortedStops})` }
    : undefined;
}

function getStrokeColor(
  strokeColor: ProgressProps['strokeColor'],
  status: ProgressStatus
) {
  if (typeof strokeColor === 'string') return strokeColor;
  if (Array.isArray(strokeColor)) return strokeColor[0];
  if (strokeColor && 'from' in strokeColor) return strokeColor.from;
  return progressStatusColor[status];
}

function getInfoNode(
  percent: number,
  successPercent: number | undefined,
  status: ProgressStatus,
  format: ProgressProps['format'] | undefined
) {
  if (format) return format(percent, successPercent);
  if (status === 'success') return '✓';
  if (status === 'exception') return '×';
  return `${percent}%`;
}

function Progress({
  className,
  indicatorClassName,
  percent,
  value,
  showInfo = false,
  format,
  status,
  type = 'line',
  strokeColor,
  railColor,
  trailColor,
  strokeWidth,
  strokeLinecap = 'round',
  size,
  steps,
  success,
  percentPosition,
  gapDegree,
  style,
  children,
  ...props
}: ProgressProps) {
  const mergedValue = clampPercent(percent ?? value ?? 0);
  const successPercent = success?.percent === undefined ? undefined : clampPercent(success.percent);
  const mergedStatus = status ?? (mergedValue >= 100 ? 'success' : 'normal');
  const info = children ?? getInfoNode(mergedValue, successPercent, mergedStatus, format);

  if (type === 'circle' || type === 'dashboard') {
    return (
      <CircleProgress
        className={className}
        percent={mergedValue}
        showInfo={showInfo}
        info={info}
        status={mergedStatus}
        strokeColor={strokeColor}
        railColor={railColor ?? trailColor}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        size={size}
        type={type}
        gapDegree={gapDegree}
        style={style}
        {...props}
      />
    );
  }

  if (steps !== undefined) {
    return (
      <StepsProgress
        className={className}
        percent={mergedValue}
        showInfo={showInfo}
        info={info}
        status={mergedStatus}
        strokeColor={strokeColor}
        railColor={railColor ?? trailColor}
        size={size}
        steps={steps}
        style={style}
        {...props}
      />
    );
  }

  return (
    <LineProgress
      className={className}
      indicatorClassName={indicatorClassName}
      percent={mergedValue}
      showInfo={showInfo}
      info={info}
      status={mergedStatus}
      strokeColor={strokeColor}
      railColor={railColor ?? trailColor}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      size={size}
      percentPosition={percentPosition}
      success={success}
      style={style}
      {...props}
    />
  );
}

type LineProgressProps = ProgressPrimitiveProps & {
  className?: string;
  indicatorClassName?: string;
  percent: number;
  showInfo: boolean;
  info: React.ReactNode;
  status: ProgressStatus;
  strokeColor?: ProgressProps['strokeColor'];
  railColor?: string;
  strokeWidth?: number;
  strokeLinecap: 'butt' | 'square' | 'round';
  size?: ProgressProps['size'];
  percentPosition?: ProgressPercentPosition;
  success?: ProgressSuccess;
};

function LineProgress({
  className,
  indicatorClassName,
  percent,
  showInfo,
  info,
  status,
  strokeColor,
  railColor,
  strokeWidth,
  strokeLinecap,
  size,
  percentPosition,
  success,
  style,
  ...props
}: LineProgressProps) {
  const height = getLineHeight(size, strokeWidth);
  const width = getLineWidth(size);
  const rounded = strokeLinecap === 'round';
  const infoInside = showInfo && percentPosition?.type === 'inner';
  const successPercent = success?.percent === undefined ? undefined : clampPercent(success.percent);
  const gradientStyle = getGradientStyle(strokeColor);
  const progressNode = (
    <ProgressPrimitive
      className={cn(
        'relative h-2 w-full flex-1 overflow-hidden bg-primary/20',
        rounded ? 'rounded-full' : 'rounded-none',
        !showInfo && className,
      )}
      style={{ width, backgroundColor: railColor, height, ...style }}
      value={percent}
      {...props}
    >
      {successPercent !== undefined && (
        <div
          className={cn('absolute inset-y-0 left-0 bg-green-500', rounded ? 'rounded-full' : 'rounded-none')}
          style={{ width: `${successPercent}%`, backgroundColor: success?.strokeColor }}
        />
      )}
      <ProgressIndicatorPrimitive
        className={cn(
          'relative h-full w-full flex-1',
          rounded ? 'rounded-full' : 'rounded-none',
          !gradientStyle && progressStatusClassName[status],
          status === 'active' && 'animate-pulse',
          indicatorClassName,
        )}
        style={gradientStyle}
      >
        {infoInside && (
          <span
            className={cn(
              'absolute inset-y-0 flex items-center px-2 text-[10px] font-medium text-primary-foreground',
              percentPosition?.align === 'start' && 'left-0',
              percentPosition?.align === 'center' && 'left-1/2 -translate-x-1/2',
              (!percentPosition?.align || percentPosition.align === 'end') && 'right-0',
            )}
          >
            {info}
          </span>
        )}
      </ProgressIndicatorPrimitive>
    </ProgressPrimitive>
  );

  if (!showInfo || infoInside) return progressNode;

  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      {progressNode}
      <span className="min-w-9 text-right text-xs tabular-nums text-muted-foreground">
        {info}
      </span>
    </div>
  );
}

type CircleProgressProps = Omit<ProgressPrimitiveProps, 'children'> & {
  className?: string;
  percent: number;
  showInfo: boolean;
  info: React.ReactNode;
  status: ProgressStatus;
  strokeColor?: ProgressProps['strokeColor'];
  railColor?: string;
  strokeWidth?: number;
  strokeLinecap: 'butt' | 'square' | 'round';
  size?: ProgressProps['size'];
  type: ProgressType;
  gapDegree?: number;
};

function CircleProgress({
  className,
  percent,
  showInfo,
  info,
  status,
  strokeColor,
  railColor,
  strokeWidth,
  strokeLinecap,
  size,
  type,
  gapDegree,
  style,
  ...props
}: CircleProgressProps) {
  const width = getCircleSize(size);
  const stroke = strokeWidth ?? Math.max(4, width * 0.06);
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = type === 'dashboard' ? gapDegree ?? 75 : 0;
  const visibleLength = circumference * ((360 - gap) / 360);
  const dashOffset = visibleLength * (1 - percent / 100);
  const strokeValue = getStrokeColor(strokeColor, status);

  return (
    <div
      data-slot="progress-circle"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width, height: width, ...style }}
      {...props}
    >
      <svg className="size-full -rotate-90" viewBox={`0 0 ${width} ${width}`}>
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={railColor ?? 'var(--muted)'}
          strokeWidth={stroke}
          strokeLinecap={strokeLinecap}
          strokeDasharray={`${visibleLength} ${circumference}`}
          transform={type === 'dashboard' ? `rotate(${gap / 2} ${width / 2} ${width / 2})` : undefined}
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={strokeValue}
          strokeWidth={stroke}
          strokeLinecap={strokeLinecap}
          strokeDasharray={`${visibleLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          className={cn('transition-[stroke-dashoffset] duration-500', status === 'active' && 'animate-pulse')}
          transform={type === 'dashboard' ? `rotate(${gap / 2} ${width / 2} ${width / 2})` : undefined}
        />
      </svg>
      {showInfo && (
        <span className="absolute text-sm font-medium tabular-nums text-foreground">
          {info}
        </span>
      )}
    </div>
  );
}

type StepsProgressProps = Omit<ProgressPrimitiveProps, 'children'> & {
  className?: string;
  percent: number;
  showInfo: boolean;
  info: React.ReactNode;
  status: ProgressStatus;
  strokeColor?: ProgressProps['strokeColor'];
  railColor?: string;
  size?: ProgressProps['size'];
  steps: NonNullable<ProgressProps['steps']>;
};

function StepsProgress({
  className,
  percent,
  showInfo,
  info,
  status,
  strokeColor,
  railColor,
  size,
  steps,
  style,
  ...props
}: StepsProgressProps) {
  const count = typeof steps === 'number' ? steps : steps.count;
  const gap = typeof steps === 'number' ? 4 : steps.gap ?? 4;
  const height = getLineHeight(size) ?? 8;
  const activeCount = Math.round((percent / 100) * count);
  const activeStyle = getGradientStyle(strokeColor) ?? {
    backgroundColor: getStrokeColor(strokeColor, status),
  };

  return (
    <div
      data-slot="progress-steps"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('flex w-full items-center gap-2', className)}
      style={style}
      {...props}
    >
      <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap }}>
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            className="rounded-full bg-primary/20"
            style={{ height, backgroundColor: index < activeCount ? undefined : railColor, ...(index < activeCount ? activeStyle : undefined) }}
          />
        ))}
      </div>
      {showInfo && (
        <span className="min-w-9 text-right text-xs tabular-nums text-muted-foreground">
          {info}
        </span>
      )}
    </div>
  );
}

export {
  Progress,
  type ProgressProps,
  type ProgressStatus,
  type ProgressType,
  type ProgressSize,
  type ProgressGradient,
  type ProgressPercentPosition,
  type ProgressSuccess,
};
