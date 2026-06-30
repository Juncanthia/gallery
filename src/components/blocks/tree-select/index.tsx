import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronRight as ChevronRightIcon, ChevronsUpDown as ChevronsUpDownIcon, Bone as XIcon } from "lucide-react";

export type TreeSelectOption = {
  value: string;
  label: string;
  children?: TreeSelectOption[];
  disabled?: boolean;
  checkable?: boolean;
};

export type TreeSelectProps = {
  options: TreeSelectOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  treeCheckable?: boolean;
  placeholder?: string;
  showSearch?: boolean;
  filterTreeNode?: (inputValue: string, node: TreeSelectOption) => boolean;
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  treeDefaultExpandAll?: boolean;
};

export function TreeSelect({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  multiple = false,
  treeCheckable = false,
  placeholder = "Select...",
  showSearch = false,
  filterTreeNode,
  allowClear = true,
  disabled = false,
  className,
  triggerClassName,
  treeDefaultExpandAll = false,
}: TreeSelectProps) {
  const isControlled = controlledValue !== undefined;
  const isMultiple = multiple || treeCheckable;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
    defaultValue || (isMultiple ? [] : "")
  );
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    treeDefaultExpandAll ? new Set(getAllNodeValues(options)) : new Set()
  );

  const selectedArray = useMemo(() => {
    if (Array.isArray(selectedValue)) return selectedValue;
    return selectedValue ? [selectedValue] : [];
  }, [selectedValue]);

  const selectedLabels = useMemo(() => {
    const labels: string[] = [];
    const findLabel = (opts: TreeSelectOption[]) => {
      for (const opt of opts) {
        if (selectedArray.includes(opt.value)) {
          labels.push(opt.label);
        }
        if (opt.children) {
          findLabel(opt.children);
        }
      }
    };
    findLabel(options);
    return labels;
  }, [selectedArray, options]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchValue) return options;
    return filterNodes(options, searchValue, filterTreeNode);
  }, [options, showSearch, searchValue, filterTreeNode]);

  const handleSelect = useCallback(
    (nodeValue: string) => {
      let newValue: string | string[];

      if (isMultiple) {
        newValue = Array.isArray(selectedValue) ? [...selectedValue] : [];
        if (newValue.includes(nodeValue)) {
          newValue = newValue.filter((v) => v !== nodeValue);
        } else {
          newValue.push(nodeValue);
        }
      } else {
        newValue = selectedValue === nodeValue ? "" : nodeValue;
      }

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);

      if (!isMultiple && !treeCheckable) {
        setIsOpen(false);
      }
    },
    [selectedValue, isMultiple, treeCheckable, isControlled, onChange]
  );

  const handleToggleExpand = (nodeValue: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeValue)) {
      newExpanded.delete(nodeValue);
    } else {
      newExpanded.add(nodeValue);
    }
    setExpandedNodes(newExpanded);
  };

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = isMultiple ? [] : "";
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    },
    [isMultiple, isControlled, onChange]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outlined"
          disabled={disabled}
          className={cn("justify-between w-full", triggerClassName)}
          data-slot="tree-select-trigger"
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedArray.length > 0 && isMultiple ? (
              selectedLabels.map((label, idx) => (
                <Badge key={idx} variant="secondary">
                  {label}
                </Badge>
              ))
            ) : selectedLabels.length > 0 ? (
              <span className="truncate">{selectedLabels[0]}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {allowClear && selectedArray.length > 0 && (
              <XIcon className="h-4 w-4" onClick={handleClear} />
            )}
            <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start" data-slot="tree-select-content">
        <Command className={cn("", className)}>
          {showSearch && <CommandInput placeholder="Search..." value={searchValue} onValueChange={setSearchValue} />}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <div className="overflow-y-auto max-h-80">
              {filteredOptions.map((node) => (
                <TreeNode
                  key={node.value}
                  node={node}
                  depth={0}
                  selectedArray={selectedArray}
                  onSelect={handleSelect}
                  onToggleExpand={handleToggleExpand}
                  expandedNodes={expandedNodes}
                  isMultiple={isMultiple || treeCheckable}
                  searchValue={showSearch ? searchValue : ""}
                />
              ))}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type TreeNodeProps = {
  node: TreeSelectOption;
  depth: number;
  selectedArray: string[];
  onSelect: (value: string) => void;
  onToggleExpand: (value: string) => void;
  expandedNodes: Set<string>;
  isMultiple: boolean;
  searchValue: string;
};

function TreeNode({
  node,
  depth,
  selectedArray,
  onSelect,
  onToggleExpand,
  expandedNodes,
  isMultiple,
  searchValue,
}: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.value);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedArray.includes(node.value);

  return (
    <div key={node.value}>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm text-sm",
          isSelected && "bg-accent text-accent-foreground",
          node.disabled && "opacity-50 pointer-events-none"
        )}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() => !node.disabled && onSelect(node.value)}
      >
        {hasChildren && (
          <ChevronRightIcon
            className={cn(
              "h-4 w-4 flex-shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.value);
            }}
          />
        )}
        {!hasChildren && <div className="w-4 flex-shrink-0" />}

        {isMultiple && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(node.value)}
            onClick={(e) => e.stopPropagation()}
            disabled={node.disabled}
          />
        )}

        <span className="flex-1 truncate">{node.label}</span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.value}
              node={child}
              depth={depth + 1}
              selectedArray={selectedArray}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              expandedNodes={expandedNodes}
              isMultiple={isMultiple}
              searchValue={searchValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function filterNodes(
  nodes: TreeSelectOption[],
  searchValue: string,
  filterTreeNode?: (inputValue: string, node: TreeSelectOption) => boolean
): TreeSelectOption[] {
  return nodes.reduce((acc, node) => {
    const matches = filterTreeNode
      ? filterTreeNode(searchValue, node)
      : node.label.toLowerCase().includes(searchValue.toLowerCase());

    const filteredChildren = node.children ? filterNodes(node.children, searchValue, filterTreeNode) : [];

    if (matches || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }

    return acc;
  }, [] as TreeSelectOption[]);
}

function getAllNodeValues(nodes: TreeSelectOption[]): string[] {
  return nodes.reduce((acc, node) => {
    acc.push(node.value);
    if (node.children) {
      acc.push(...getAllNodeValues(node.children));
    }
    return acc;
  }, [] as string[]);
}
