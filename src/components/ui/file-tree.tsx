import * as React from 'react';
import { Folder as FolderIcon, FolderOpen as FolderOpenIcon, File as FileIcon } from 'lucide-react';

import {
  Files as FilesPrimitive,
  FilesHighlight as FilesHighlightPrimitive,
  FolderItem as FolderItemPrimitive,
  FolderHeader as FolderHeaderPrimitive,
  FolderTrigger as FolderTriggerPrimitive,
  FolderHighlight as FolderHighlightPrimitive,
  Folder as FolderPrimitive,
  FolderIcon as FolderIconPrimitive,
  FileLabel as FileLabelPrimitive,
  FolderContent as FolderContentPrimitive,
  FileHighlight as FileHighlightPrimitive,
  File as FilePrimitive,
  FileIcon as FileIconPrimitive,
  type FilesProps as FilesPrimitiveProps,
  type FolderItemProps as FolderItemPrimitiveProps,
  type FolderContentProps as FolderContentPrimitiveProps,
  type FileProps as FilePrimitiveProps,
  type FileLabelProps as FileLabelPrimitiveProps,
} from '@/components/_primitives/radix/file-tree';
import { cn } from '@/lib/utils';

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
