'use client';

import * as React from 'react';
import {Tabs as RadixTabs} from 'radix-ui';
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
  type Transition,
} from 'motion/react';
import {
  Highlight,
  HighlightItem,
  type HighlightProps,
  type HighlightItemProps,
} from '@/_internals/foundations/primitives/effects/highlight';
import { getStrictContext } from '@/_internals/foundations/utils/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';
import {
  AutoHeight,
  type AutoHeightProps,
} from '@/_internals/foundations/primitives/effects/auto-height';
import { cn } from '@/_internals/foundations/utils/cn';

type TabsContextType = {
  value: string | undefined;
  setValue: TabsPrimitiveProps['onValueChange'];
};

const [TabsProvider, useTabs] =
  getStrictContext<TabsContextType>('TabsContext');

type TabsPrimitiveProps = React.ComponentProps<typeof RadixTabs.Root>;

function TabsPrimitive(props: TabsPrimitiveProps) {
  const [value, setValue] = useControlledState({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onValueChange,
  });

  return (
    <TabsProvider value={{ value, setValue }}>
      <RadixTabs.Root
        data-slot="tabs"
        {...props}
        onValueChange={setValue}
      />
    </TabsProvider>
  );
}

type TabsHighlightProps = Omit<HighlightProps, 'controlledItems' | 'value'>;

function TabsHighlightPrimitive({
  transition = { type: 'spring', stiffness: 200, damping: 25 },
  ...props
}: TabsHighlightProps) {
  const { value } = useTabs();

  return (
    <Highlight
      data-slot="tabs-highlight"
      controlledItems
      value={value}
      transition={transition}
      click={false}
      {...props}
    />
  );
}

type TabsListPrimitiveProps = React.ComponentProps<typeof RadixTabs.List>;

function TabsListPrimitive(props: TabsListPrimitiveProps) {
  return <RadixTabs.List data-slot="tabs-list" {...props} />;
}

type TabsHighlightItemProps = HighlightItemProps & {
  value: string;
};

function TabsHighlightItemPrimitive(props: TabsHighlightItemProps) {
  return <HighlightItem data-slot="tabs-highlight-item" {...props} />;
}

type TabsTriggerPrimitiveProps = React.ComponentProps<typeof RadixTabs.Trigger>;

function TabsTriggerPrimitive(props: TabsTriggerPrimitiveProps) {
  return <RadixTabs.Trigger data-slot="tabs-trigger" {...props} />;
}

type TabsContentPrimitiveProps = React.ComponentProps<typeof RadixTabs.Content> &
  HTMLMotionProps<'div'>;

function TabsContentPrimitive({
  value,
  forceMount,
  transition = { duration: 0.5, ease: 'easeInOut' },
  ...props
}: TabsContentPrimitiveProps) {
  return (
    <AnimatePresence mode="wait">
      <RadixTabs.Content asChild forceMount={forceMount} value={value}>
        <motion.div
          data-slot="tabs-content"
          layout
          layoutDependency={value}
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={transition}
          {...props}
        />
      </RadixTabs.Content>
    </AnimatePresence>
  );
}

type TabsContentsAutoProps = AutoHeightProps & {
  mode?: 'auto-height';
  children: React.ReactNode;
  transition?: Transition;
};

type TabsContentsLayoutProps = Omit<HTMLMotionProps<'div'>, 'transition'> & {
  mode: 'layout';
  children: React.ReactNode;
  transition?: Transition;
};

type TabsContentsPrimitiveProps = TabsContentsAutoProps | TabsContentsLayoutProps;

const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
};

function isAutoMode(props: TabsContentsPrimitiveProps): props is TabsContentsAutoProps {
  return !('mode' in props) || props.mode === 'auto-height';
}

function TabsContentsPrimitive(props: TabsContentsPrimitiveProps) {
  const { value } = useTabs();

  if (isAutoMode(props)) {
    const { transition = defaultTransition, ...autoProps } = props;

    return (
      <AutoHeight
        data-slot="tabs-contents"
        deps={[value]}
        transition={transition}
        {...autoProps}
      />
    );
  }

  const { transition = defaultTransition, style, ...layoutProps } = props;

  return (
    <motion.div
      data-slot="tabs-contents"
      layout="size"
      layoutDependency={value}
      style={{ overflow: 'hidden', ...style }}
      transition={{ layout: transition }}
      {...layoutProps}
    />
  );
}

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

function Tabs({
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
    );
  }

  return (
    <TabsPrimitive
      className={cn('flex flex-col gap-2', className)}
      defaultValue={mergedValue === undefined ? mergedDefaultValue : undefined}
      orientation={orientation}
      value={mergedValue}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

type TabsVariant = 'default' | 'underline';

const TabsVariantContext = React.createContext<TabsVariant>('default');

type TabsListProps = TabsListPrimitiveProps & {
  variant?: TabsVariant;
};

function TabsList({ className, variant = 'default', ...props }: TabsListProps) {
  if (variant === 'underline') {
    return (
      <TabsVariantContext.Provider value="underline">
        <TabsListPrimitive
          className={cn(
            'text-muted-foreground inline-flex h-9 w-fit items-center justify-center border-b bg-transparent p-0 data-[orientation=vertical]:h-fit data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0',
            className,
          )}
          {...props}
        />
      </TabsVariantContext.Provider>
    );
  }

  return (
    <TabsVariantContext.Provider value="default">
      <TabsHighlightPrimitive
        className={cn(
          "absolute z-0 inset-0 rounded-md transition-all duration-200",
          "border border-transparent bg-background dark:border-input dark:bg-input/30 shadow-sm"
        )}
      >
        <TabsListPrimitive
          className={cn(
            'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] data-[orientation=vertical]:h-fit data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
            className,
          )}
          {...props}
        />
      </TabsHighlightPrimitive>
    </TabsVariantContext.Provider>
  );
}

type TabsTriggerProps = TabsTriggerPrimitiveProps & {
};

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  const variant = React.useContext(TabsVariantContext);

  if (variant === 'underline') {
    return (
      <TabsTriggerPrimitive
        className={cn(
          "text-muted-foreground data-[state=active]:text-foreground data-[state=active]:border-b-primary inline-flex h-full flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <TabsHighlightItemPrimitive value={props.value} className="flex-1">
      <TabsTriggerPrimitive
        className={cn(
          "data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md w-full px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-500 ease-in-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

function TabsContent({
  className,
  keepMounted,
  ...props
}: TabsContentProps & { keepMounted?: boolean }) {
  return (
    <TabsContentPrimitive
      className={cn('flex-1 outline-none', className)}
      forceMount={keepMounted ? true : props.forceMount}
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
