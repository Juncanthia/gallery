import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
  type ProgressProps as ProgressPrimitiveProps,
} from '@/primitives/radix/progress';
import { cn } from '@/lib/utils';

type ProgressProps = ProgressPrimitiveProps & {
  indicatorClassName?: string;
};

function Progress({ className, indicatorClassName, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <ProgressIndicatorPrimitive
        className={cn('bg-primary h-full w-full flex-1', indicatorClassName)}
      />
    </ProgressPrimitive>
  );
}

export { Progress, type ProgressProps };