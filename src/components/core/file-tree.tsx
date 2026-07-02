'use client';

import * as React from 'react';
import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from '@/_internals/foundations/primitives/effects/highlight';
import {
  AccordionPrimitive as Accordion,
  AccordionItemPrimitive as AccordionItem,
  AccordionHeaderPrimitive as AccordionHeader,
  AccordionTriggerPrimitive as AccordionTrigger,
  AccordionContentPrimitive as AccordionContent,
  type AccordionPrimitiveProps as AccordionProps,
  type AccordionItemPrimitiveProps as AccordionItemProps,
  type AccordionHeaderProps,
  type AccordionTriggerPrimitiveProps as AccordionTriggerProps,
  type AccordionContentPrimitiveProps as AccordionContentProps,
} from '@/components/core/accordion';
import { getStrictContext } from '@/_internals/foundations/utils/get-strict-context';
import { useControlledState } from '@/_internals/foundations/hooks/use-controlled-state';
import { Folder as FolderIcon, FolderOpen as FolderOpenIcon, File as FileIcon } from 'lucide-react';
import { cn } from '@/_internals/foundations/utils/cn';

type FilesContextType = {
  open: string[];
};

type FolderContextType = {
  isOpen: boolean;
};

const [FilesProvider, useFiles] =
  getStrictContext<FilesContextType>('FilesContext');

const [FolderProvider, useFolder] =
  getStrictContext<FolderContextType>('FolderContext');

type BaseFilesProps = {
  children: React.ReactNode;
} & Omit<AccordionProps, 'type' | 'defaultValue' | 'value' | 'onValueChange'>;

type ControlledFilesProps = {
  defaultOpen?: never;
  open?: string[];
  onOpenChange?: (open: string[]) => void;
};

type UncontrolledFilesProps = {
  defaultOpen: string[];
  open?: never;
  onOpenChange?: never;
};

type FilesPrimitiveProps = BaseFilesProps &
  (ControlledFilesProps | UncontrolledFilesProps);

function FilesPrimitive({
  children,
  defaultOpen = [],
  open,
  onOpenChange,
  style,
  ...props
}: FilesPrimitiveProps) {
  const [openValue, setOpenValue] = useControlledState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <FilesProvider value={{ open: openValue ?? [] }}>
      <Accordion
        data-slot="files"
        type="multiple"
        defaultValue={defaultOpen}
        value={open}
        onValueChange={setOpenValue}
        style={{
          position: 'relative',
          overflow: 'auto',
          ...style,
        }}
        {...props}
      >
        {children}
      </Accordion>
    </FilesProvider>
  );
}

type FilesHighlightProps = Omit<HighlightProps, 'controlledItems' | 'mode'>;

function FilesHighlightPrimitive({ hover = true, ...props }: FilesHighlightProps) {
  return (
    <Highlight
      data-slot="files-highlight"
      controlledItems
      mode="parent"
      hover={hover}
      {...props}
    />
  );
}

type FolderItemPrimitiveProps = AccordionItemProps;

function FolderItemPrimitive({ value, ...props }: FolderItemPrimitiveProps) {
  const { open } = useFiles();

  return (
    <FolderProvider value={{ isOpen: open.includes(value) }}>
      <AccordionItem data-slot="folder-item" value={value} {...props} />
    </FolderProvider>
  );
}

type FolderHeaderProps = AccordionHeaderProps;

function FolderHeaderPrimitive(props: FolderHeaderProps) {
  return <AccordionHeader data-slot="folder-header" {...props} />;
}

type FolderTriggerPrimitiveProps = AccordionTriggerProps;

function FolderTriggerPrimitive(props: FolderTriggerPrimitiveProps) {
  return <AccordionTrigger data-slot="folder-trigger" {...props} />;
}

type FolderContentPrimitiveProps = AccordionContentProps;

function FolderContentPrimitive(props: FolderContentPrimitiveProps) {
  return <AccordionContent data-slot="folder-content" {...props} />;
}

type FolderHighlightProps = HighlightItemProps;

function FolderHighlightPrimitive(props: FolderHighlightProps) {
  return <HighlightItem data-slot="folder-highlight" {...props} />;
}

type FolderProps = React.ComponentProps<'div'>;

function FolderPrimitive(props: FolderProps) {
  return <div data-slot="folder" {...props} />;
}

type FolderIconProps = HTMLMotionProps<'span'> & {
  closeIcon: React.ReactNode;
  openIcon: React.ReactNode;
};

function FolderIconPrimitive({
  closeIcon,
  openIcon,
  transition = { duration: 0.15 },
  ...props
}: FolderIconProps) {
  const { isOpen } = useFolder();

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={isOpen ? 'open' : 'close'}
        data-slot="folder-icon"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={transition}
        {...props}
      >
        {isOpen ? openIcon : closeIcon}
      </motion.span>
    </AnimatePresence>
  );
}

type FileHighlightProps = HighlightItemProps;

function FileHighlightPrimitive(props: FileHighlightProps) {
  return <HighlightItem data-slot="file-highlight" {...props} />;
}

type FilePrimitiveProps = React.ComponentProps<'div'>;

function FilePrimitive(props: FilePrimitiveProps) {
  return <div data-slot="file" {...props} />;
}

type FileIconProps = React.ComponentProps<'span'>;

function FileIconPrimitive(props: FileIconProps) {
  return <span data-slot="file-icon" {...props} />;
}

type FileLabelPrimitiveProps = React.ComponentProps<'span'>;

function FileLabelPrimitive(props: FileLabelPrimitiveProps) {
  return <span data-slot="file-label" {...props} />;
}

type GitStatus = 'untracked' | 'modified' | 'deleted';

type FileTreeDataNode = {
  key: string;
  title: React.ReactNode;
  children?: FileTreeDataNode[];
  icon?: React.ElementType | React.ReactNode;
  gitStatus?: GitStatus;
  disabled?: boolean;
  selectable?: boolean;
  isLeaf?: boolean;
  className?: string;
}

type FileTreeSelectInfo = {
  selected: boolean;
  selectedKeys: React.Key[];
  node: FileTreeDataNode;
}

type FilesProps = Omit<FilesPrimitiveProps, 'children' | 'defaultOpen' | 'open' | 'onOpenChange' | 'onSelect'> & {
  children?: React.ReactNode;
  treeData?: FileTreeDataNode[];
  defaultExpandedKeys?: React.Key[];
  expandedKeys?: React.Key[];
  onExpandedKeysChange?: (keys: React.Key[]) => void;
  defaultSelectedKeys?: React.Key[];
  selectedKeys?: React.Key[];
  onSelect?: (selectedKeys: React.Key[], info: FileTreeSelectInfo) => void;
  selectable?: boolean;
  showIcon?: boolean;
  showLine?: boolean;
}

function toStringKeys(keys?: React.Key[]) {
  return keys?.map(String) ?? [];
}

function useMergedKeys({
  value,
  defaultValue = [],
  onChange,
}: {
  value?: React.Key[];
  defaultValue?: React.Key[];
  onChange?: (keys: React.Key[]) => void;
}) {
  const [internalValue, setInternalValue] = React.useState<React.Key[]>(defaultValue);
  const mergedValue = value ?? internalValue;

  const setValue = React.useCallback((nextValue: React.Key[]) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }, [onChange, value]);

  return [mergedValue, setValue] as const;
}

function Files({
  className,
  children,
  treeData,
  defaultExpandedKeys,
  expandedKeys,
  onExpandedKeysChange,
  defaultSelectedKeys,
  selectedKeys,
  onSelect,
  selectable = true,
  showIcon = true,
  showLine = true,
  ...props
}: FilesProps) {
  const [mergedExpandedKeys, setExpandedKeys] = useMergedKeys({
    value: expandedKeys,
    defaultValue: defaultExpandedKeys,
    onChange: onExpandedKeysChange,
  });
  const [mergedSelectedKeys, setSelectedKeys] = useMergedKeys({
    value: selectedKeys,
    defaultValue: defaultSelectedKeys,
  });

  const handleSelect = React.useCallback((node: FileTreeDataNode) => {
    if (!selectable || node.disabled || node.selectable === false) {
      return;
    }

    const key = node.key;
    const selected = !mergedSelectedKeys.includes(key);
    const nextKeys = selected ? [key] : [];

    setSelectedKeys(nextKeys);
    onSelect?.(nextKeys, { selected, selectedKeys: nextKeys, node });
  }, [mergedSelectedKeys, onSelect, selectable, setSelectedKeys]);

  if (treeData) {
    return (
      <FilesPrimitive
        className={cn('w-full p-2', className)}
        open={toStringKeys(mergedExpandedKeys)}
        onOpenChange={(open) => setExpandedKeys(open)}
        {...props}
      >
        <FilesHighlightPrimitive className="pointer-events-none rounded bg-accent">
          {treeData.map((node) => (
            <FileTreeNode
              key={node.key}
              node={node}
              selectedKeys={mergedSelectedKeys}
              onSelect={handleSelect}
              showIcon={showIcon}
              showLine={showLine}
              selectable={selectable}
            />
          ))}
        </FilesHighlightPrimitive>
      </FilesPrimitive>
    );
  }

  return (
    <FilesPrimitive className={cn('w-full p-2', className)} {...props}>
      <FilesHighlightPrimitive className="pointer-events-none rounded bg-accent">
        {children}
      </FilesHighlightPrimitive>
    </FilesPrimitive>
  );
}

type FileTreeNodeProps = {
  node: FileTreeDataNode;
  selectedKeys: React.Key[];
  onSelect: (node: FileTreeDataNode) => void;
  showIcon: boolean;
  showLine: boolean;
  selectable: boolean;
}

function renderNodeIcon(icon: FileTreeDataNode['icon'], fallback: React.ElementType) {
  if (React.isValidElement(icon)) {
    return icon;
  }

  const Icon = (icon ?? fallback) as React.ComponentType<{ className?: string }>;
  return <Icon className="size-4.5" />;
}

function FileTreeNode({ node, selectedKeys, onSelect, showIcon, showLine, selectable }: FileTreeNodeProps) {
  const hasChildren = !!node.children?.length && !node.isLeaf;
  const selected = selectedKeys.includes(node.key);

  if (hasChildren) {
    return (
      <FolderItem value={node.key}>
        <FolderTrigger
          gitStatus={node.gitStatus}
          selected={selected}
          disabled={node.disabled}
          selectable={selectable && node.selectable !== false}
          onSelect={() => onSelect(node)}
        >
          {node.title}
        </FolderTrigger>
        <FolderContent showLine={showLine}>
          {node.children?.map((child) => (
            <FileTreeNode
              key={child.key}
              node={child}
              selectedKeys={selectedKeys}
              onSelect={onSelect}
              showIcon={showIcon}
              showLine={showLine}
              selectable={selectable}
            />
          ))}
        </FolderContent>
      </FolderItem>
    );
  }

  return (
    <FileItem
      icon={showIcon ? node.icon : false}
      gitStatus={node.gitStatus}
      selected={selected}
      disabled={node.disabled}
      selectable={selectable && node.selectable !== false}
      onSelect={() => onSelect(node)}
      className={node.className}
    >
      {node.title}
    </FileItem>
  );
}

type SubFilesProps = FilesPrimitiveProps;

function SubFiles(props: SubFilesProps) {
  return <FilesPrimitive {...props} />;
}

type FolderItemProps = FolderItemPrimitiveProps;

function FolderItem(props: FolderItemProps) {
  return <FolderItemPrimitive {...props} />;
}

type FolderTriggerProps = FileLabelPrimitiveProps & {
  gitStatus?: GitStatus;
  selected?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  onSelect?: () => void;
};

function FolderTrigger({
  children,
  className,
  gitStatus,
  selected,
  disabled,
  selectable,
  onSelect,
  ...props
}: FolderTriggerProps) {
  return (
    <FolderHeaderPrimitive>
      <FolderTriggerPrimitive
        className="w-full text-start"
        disabled={disabled}
        onClick={() => onSelect?.()}
      >
        <FolderHighlightPrimitive>
          <FolderPrimitive
            className={cn(
              'flex items-center justify-between gap-2 rounded p-2 transition-colors',
              selectable && 'cursor-pointer',
              selected && 'bg-accent text-accent-foreground',
              disabled && 'pointer-events-none opacity-50',
            )}
          >
            <div
              className={cn(
                'flex items-center gap-2',
                gitStatus === 'untracked' && 'text-green-500',
                gitStatus === 'modified' && 'text-amber-500',
                gitStatus === 'deleted' && 'text-red-500',
              )}
            >
              <FolderIconPrimitive
                closeIcon={<FolderIcon className="size-4.5" />}
                openIcon={<FolderOpenIcon className="size-4.5" />}
              />
              <FileLabelPrimitive
                className={cn('text-sm', className)}
                {...props}
              >
                {children}
              </FileLabelPrimitive>
            </div>

            {gitStatus && (
              <span
                className={cn(
                  'size-2 rounded-full',
                  gitStatus === 'untracked' && 'bg-green-500',
                  gitStatus === 'modified' && 'bg-amber-500',
                  gitStatus === 'deleted' && 'bg-red-500',
                )}
              />
            )}
          </FolderPrimitive>
        </FolderHighlightPrimitive>
      </FolderTriggerPrimitive>
    </FolderHeaderPrimitive>
  );
}

type FolderContentProps = FolderContentPrimitiveProps & {
  showLine?: boolean;
};

function FolderContent({ className, showLine = true, ...props }: FolderContentProps) {
  return (
    <div className={cn('relative ml-6', showLine && 'before:absolute before:-left-2 before:inset-y-0 before:h-full before:w-px before:bg-border', className)}>
      <FolderContentPrimitive {...props} />
    </div>
  );
}

type FileItemProps = FilePrimitiveProps & {
  icon?: React.ElementType | React.ReactNode | false;
  gitStatus?: GitStatus;
  selected?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  onSelect?: () => void;
};

function FileItem({
  icon = FileIcon,
  className,
  children,
  gitStatus,
  selected,
  disabled,
  selectable,
  onSelect,
  ...props
}: FileItemProps) {
  return (
    <FileHighlightPrimitive onClick={disabled ? undefined : onSelect}>
      <FilePrimitive
        className={cn(
          'flex items-center justify-between gap-2 rounded p-2 transition-colors',
          selectable && 'cursor-pointer',
          selected && 'bg-accent text-accent-foreground',
          disabled && 'pointer-events-none opacity-50',
          gitStatus === 'untracked' && 'text-green-500',
          gitStatus === 'modified' && 'text-amber-500',
          gitStatus === 'deleted' && 'text-red-500',
        )}
      >
        <div className="flex items-center gap-2">
          {icon !== false ? (
            <FileIconPrimitive>
              {renderNodeIcon(icon, FileIcon)}
            </FileIconPrimitive>
          ) : null}
          <FileLabelPrimitive className={cn('text-sm', className)} {...props}>
            {children}
          </FileLabelPrimitive>
        </div>

        {gitStatus && (
          <span className="text-sm font-medium">
            {gitStatus === 'untracked' && 'U'}
            {gitStatus === 'modified' && 'M'}
            {gitStatus === 'deleted' && 'D'}
          </span>
        )}
      </FilePrimitive>
    </FileHighlightPrimitive>
  );
}

export {
  Files,
  FolderItem,
  FolderTrigger,
  FolderContent,
  FileItem,
  SubFiles,
  type FilesProps,
  type FolderItemProps,
  type FolderTriggerProps,
  type FolderContentProps,
  type FileItemProps,
  type SubFilesProps,
  type FileTreeDataNode,
  type FileTreeSelectInfo,
};
