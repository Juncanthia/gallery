import * as React from 'react';

import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContent as TabsContentPrimitive,
  TabsContents as TabsContentsPrimitive,
  TabsHighlight as TabsHighlightPrimitive,
  TabsHighlightItem as TabsHighlightItemPrimitive,
  type TabsProps as TabsPrimitiveProps,
  type TabsListProps as TabsListPrimitiveProps,
  type TabsTriggerProps as TabsTriggerPrimitiveProps,
  type TabsContentProps as TabsContentPrimitiveProps,
  type TabsContentsProps as TabsContentsPrimitiveProps,
} from '@/primitives/radix/tabs';
import { cn } from '@/lib/utils';

type TabsSize = 'small' | 'middle' | 'large';
type TabsType = 'line' | 'card';
type TabsPlacement = 'top' | 'bottom' | 'start' | 'end';

type TabsItem = {
  key: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  forceRender?: boolean;
  icon?: React.ReactNode;
};

type TabsProps = TabsPrimitiveProps & {
  variant?: 'default' | 'skeuomorphic';
  activeKey?: string;
  centered?: boolean;
  defaultActiveKey?: string;
  items?: TabsItem[];
  onChange?: (key: string) => void;
  size?: TabsSize;
  tabBarExtraContent?: React.ReactNode | {
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
  tabBarGutter?: number;
  tabPlacement?: TabsPlacement;
  type?: TabsType;
};

const tabsRootPlacementClasses: Record<TabsPlacement, string> = {
  top: 'flex-col',
  bottom: 'flex-col',
  start: 'flex-row gap-3',
  end: 'flex-row-reverse gap-3',
};

const tabsTriggerSizeClasses: Record<TabsSize, string> = {
  small: 'h-7 px-2 text-xs',
  middle: 'h-[calc(100%-1px)] px-2 text-sm',
  large: 'h-9 px-3 text-sm',
};

function isTabsExtraContentObject(
  extra: TabsProps['tabBarExtraContent'],
): extra is { left?: React.ReactNode; right?: React.ReactNode } {
  return (
    typeof extra === 'object' &&
    extra !== null &&
    !React.isValidElement(extra) &&
    ('left' in extra || 'right' in extra)
  );
}

const TabsContext = React.createContext<{ variant?: 'default' | 'skeuomorphic' }>({ variant: 'default' });

function Tabs({
  variant = 'default',
  activeKey,
  centered,
  className,
  defaultActiveKey,
  defaultValue,
  items,
  onChange,
  onValueChange,
  size = 'middle',
  tabBarExtraContent,
  tabBarGutter,
  tabPlacement = 'top',
  type = 'line',
  value,
  ...props
}: TabsProps) {
  const mergedDefaultValue = defaultActiveKey ?? defaultValue ?? items?.[0]?.key;
  const mergedValue = activeKey ?? value;
  const orientation = tabPlacement === 'start' || tabPlacement === 'end' ? 'vertical' : props.orientation;

  const handleValueChange = (key: string) => {
    onValueChange?.(key);
    onChange?.(key);
  };

  if (items?.length) {
    const hasExtraObject = isTabsExtraContentObject(tabBarExtraContent);
    const extraLeft = hasExtraObject ? tabBarExtraContent.left : null;
    const extraRight = hasExtraObject ? tabBarExtraContent.right : tabBarExtraContent;
    const list = (
      <div className={cn(
        'flex items-center gap-2',
        centered && orientation !== 'vertical' && 'justify-center',
        orientation === 'vertical' && 'flex-col items-stretch',
      )}>
        {extraLeft}
        <TabsList
          className={cn(
            type === 'card' && 'bg-transparent p-0 gap-1',
            orientation === 'vertical' && 'h-fit w-36 flex-col items-stretch',
          )}
          style={tabBarGutter !== undefined ? { gap: tabBarGutter } : undefined}
        >
          {items.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              disabled={item.disabled}
              className={cn(
                tabsTriggerSizeClasses[size],
                type === 'card' && 'border data-[state=active]:bg-background',
                orientation === 'vertical' && 'justify-start',
              )}
            >
              {item.icon && <span className="inline-flex shrink-0">{item.icon}</span>}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {extraRight}
      </div>
    );

    const contents = (
      <TabsContents>
        {items.map((item) => (
          <TabsContent key={item.key} value={item.key} forceMount={item.forceRender || undefined}>
            {item.children}
          </TabsContent>
        ))}
      </TabsContents>
    );

    return (
      <TabsContext.Provider value={{ variant }}>
        <TabsPrimitive
          className={cn('flex gap-2', tabsRootPlacementClasses[tabPlacement], className)}
          defaultValue={mergedValue === undefined ? mergedDefaultValue : undefined}
          orientation={orientation}
          value={mergedValue}
          onValueChange={handleValueChange}
          {...props}
        >
          {tabPlacement === 'bottom' ? contents : list}
          {tabPlacement === 'bottom' ? list : contents}
        </TabsPrimitive>
      </TabsContext.Provider>
    );
  }

  return (
    <TabsContext.Provider value={{ variant }}>
      <TabsPrimitive
        className={cn('flex flex-col gap-2', className)}
        defaultValue={mergedValue === undefined ? mergedDefaultValue : undefined}
        orientation={orientation}
        value={mergedValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsContext.Provider>
  );
}

type TabsListProps = TabsListPrimitiveProps & {
  variant?: 'default' | 'skeuomorphic';
};

function TabsList({ className, variant, ...props }: TabsListProps) {
  const context = React.useContext(TabsContext);
  const mergedVariant = variant ?? context.variant;
  const isSkeuomorphic = mergedVariant === 'skeuomorphic';
  return (
    <TabsHighlightPrimitive
      className={cn(
        "absolute z-0 inset-0 rounded-md transition-all duration-200",
        isSkeuomorphic
          ? "bg-linear-to-b from-white to-neutral-100 dark:from-zinc-700 dark:to-zinc-800 border border-neutral-300 dark:border-zinc-600 shadow-[0_2px_4px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          : "border border-transparent bg-background dark:border-input dark:bg-input/30 shadow-sm"
      )}
    >
      <TabsListPrimitive
        className={cn(
          isSkeuomorphic
            ? 'bg-neutral-100 dark:bg-zinc-950 border border-neutral-300 dark:border-zinc-700 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.1)] text-neutral-500 dark:text-zinc-400 inline-flex h-9 w-fit items-center justify-center p-[3px] data-[orientation=vertical]:h-fit data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch'
            : 'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] data-[orientation=vertical]:h-fit data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
          className,
        )}
        {...props}
      />
    </TabsHighlightPrimitive>
  );
}

type TabsTriggerProps = TabsTriggerPrimitiveProps & {
  variant?: 'default' | 'skeuomorphic';
};

function TabsTrigger({ className, variant, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const mergedVariant = variant ?? context.variant;
  const isSkeuomorphic = mergedVariant === 'skeuomorphic';
  return (
    <TabsHighlightItemPrimitive value={props.value} className="flex-1">
      <TabsTriggerPrimitive
        className={cn(
          isSkeuomorphic
            ? "data-[state=active]:text-neutral-800 dark:data-[state=active]:text-white focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:outline-blue-500 text-neutral-500 dark:text-zinc-400 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md w-full px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            : "data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md w-full px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-500 ease-in-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    </TabsHighlightItemPrimitive>
  );
}

type TabsContentsProps = TabsContentsPrimitiveProps;

function TabsContents(props: TabsContentsProps) {
  return <TabsContentsPrimitive {...props} />;
}

type TabsContentProps = TabsContentPrimitiveProps;

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsContentPrimitive
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentsProps,
  type TabsContentProps,
  type TabsItem,
  type TabsPlacement,
  type TabsSize,
  type TabsType,
};
