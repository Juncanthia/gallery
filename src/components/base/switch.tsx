import * as React from 'react';
import { LoaderCircle } from 'lucide-react';

import {
  Switch as SwitchPrimitive,
  SwitchThumb as SwitchThumbPrimitive,
  SwitchIcon as SwitchIconPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from '@/primitives/radix/switch';
import { cn } from '@/lib/utils';

type SwitchSize = 'small' | 'middle';

const switchSizeClasses: Record<SwitchSize, string> = {
  small: 'h-4 w-7',
  middle: 'h-5 w-8',
};

const switchWithContentSizeClasses: Record<SwitchSize, string> = {
  small: 'h-4 min-w-9',
  middle: 'h-5 min-w-11',
};

const switchThumbSizeClasses: Record<SwitchSize, string> = {
  small: 'size-3',
  middle: 'size-4',
};

const switchPressedWidths: Record<SwitchSize, number> = {
  small: 15,
  middle: 19,
};

type SwitchProps = Omit<SwitchPrimitiveProps, 'onChange'> & {
  size?: SwitchSize;
  loading?: boolean;
  pressedWidth?: number;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  thumbIcon?: React.ReactElement;
  onChange?: (checked: boolean) => void;
};

function Switch({
  className,
  size = 'middle',
  loading,
  disabled,
  pressedWidth,
  checkedChildren,
  unCheckedChildren,
  thumbIcon,
  onCheckedChange,
  onChange,
  ...props
}: SwitchProps) {
  const hasContent = checkedChildren !== undefined || unCheckedChildren !== undefined;
  const mergedDisabled = disabled || loading;
  const mergedThumbIcon = loading ? (
    <LoaderCircle className="animate-spin" />
  ) : (
    thumbIcon
  );

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      onCheckedChange?.(checked);
      onChange?.(checked);
    },
    [onChange, onCheckedChange],
  );

  return (
    <SwitchPrimitive
      className={cn(
        'relative peer focus-visible:border-ring focus-visible:ring-ring/50 flex px-px shrink-0 items-center justify-start rounded-full border border-transparent shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 data-[state=checked]:justify-end',
        hasContent ? switchWithContentSizeClasses[size] : switchSizeClasses[size],
        className,
      )}
      disabled={mergedDisabled}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <SwitchThumbPrimitive
        className={cn(
          'relative z-10 bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0',
          switchThumbSizeClasses[size],
        )}
        pressedAnimation={{ width: pressedWidth ?? switchPressedWidths[size] }}
      >
        {mergedThumbIcon && (
          <SwitchIconPrimitive
            position="thumb"
            className="absolute [&_svg]:size-[9px] left-1/2 top-1/2 -translate-1/2 dark:text-neutral-500 text-neutral-400"
          >
            {mergedThumbIcon}
          </SwitchIconPrimitive>
        )}
      </SwitchThumbPrimitive>

      {checkedChildren !== undefined && (
        <SwitchIconPrimitive
          position="left"
          className={cn(
            'pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] leading-none text-primary-foreground [&_svg]:size-[9px]',
            size === 'small' && 'left-1 text-[9px]',
          )}
        >
          {checkedChildren}
        </SwitchIconPrimitive>
      )}
      {unCheckedChildren !== undefined && (
        <SwitchIconPrimitive
          position="right"
          className={cn(
            'pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] leading-none text-muted-foreground [&_svg]:size-[9px]',
            size === 'small' && 'right-1 text-[9px]',
          )}
        >
          {unCheckedChildren}
        </SwitchIconPrimitive>
      )}
    </SwitchPrimitive>
  );
}

export { Switch, type SwitchProps, type SwitchSize };
