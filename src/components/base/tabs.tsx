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
  icon?: React.ReactNode;
};

type TabsProps = TabsPrimitiveProps & {
  activeKey?: string;
  defaultActiveKey?: string;
  items?: TabsItem[];
  onChange?: (key: string) => void;
  size?: TabsSize;
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

function Tabs({
  activeKey,
  className,
  defaultActiveKey,
  defaultValue,
  items,
  onChange,
  onValueChange,
  size = 'middle',
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
    const list = (
      <TabsList
        className={cn(
          type === 'card' && 'bg-transparent p-0 gap-1',
          orientation === 'vertical' && 'h-fit w-36 flex-col items-stretch',
        )}
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
    );

    const contents = (
      <TabsContents>
        {items.map((item) => (
          <TabsContent key={item.key} value={item.key}>
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

type TabsListProps = TabsListPrimitiveProps;

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsHighlightPrimitive className="absolute z-0 inset-0 border border-transparent rounded-md bg-background dark:border-input dark:bg-input/30 shadow-sm">
      <TabsListPrimitive
        className={cn(
          'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] data-[orientation=vertical]:h-fit data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
          className,
        )}
        {...props}
      />
    </TabsHighlightPrimitive>
  );
}

type TabsTriggerProps = TabsTriggerPrimitiveProps;

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
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