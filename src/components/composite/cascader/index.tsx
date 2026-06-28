import { useState, useMemo, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/base/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/base/popover";
import { ChevronRight as ChevronRightIcon, Bone as XIcon, ChevronsUpDown as ChevronsUpDownIcon } from "lucide-react";

export type CascaderOption = {
  value: string;
  label: ReactNode;
  children?: CascaderOption[];
  disabled?: boolean;
  leaf?: boolean;
};

export type CascaderProps = {
  options: CascaderOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], options: CascaderOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  displayRender?: (labels: string[]) => ReactNode;
  allowClear?: boolean;
  className?: string;
  triggerClassName?: string;
};

export function Cascader({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
  displayRender,
  allowClear = true,
  className,
  triggerClassName,
}: CascaderProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue);
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  const [isOpen, setIsOpen] = useState(false);

  const selectedLabels = useMemo(() => {
    const labels: string[] = [];
    let current = options;

    for (const val of selectedValue) {
      const found = current.find((opt) => opt.value === val);
      if (found) {
        labels.push(String(found.label));
        current = found.children || [];
      } else {
        break;
      }
    }

    return labels;
  }, [selectedValue, options]);

  const handleSelect = useCallback(
    (path: string[], pathOptions: CascaderOption[]) => {
      if (!isControlled) {
        setUncontrolledValue(path);
      }
      onChange?.(path, pathOptions);
    },
    [isControlled, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) {
        setUncontrolledValue([]);
      }
      onChange?.([], []);
    },
    [isControlled, onChange]
  );

  const displayText = displayRender
    ? displayRender(selectedLabels)
    : selectedLabels.length > 0
      ? selectedLabels.join(" / ")
      : placeholder;

  return (
    <div className={cn("", className)} data-slot="cascader">
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outlined"
          disabled={disabled}
          className={cn("justify-between w-full", triggerClassName)}
          data-slot="cascader-trigger"
        >
          <span className="truncate text-left flex-1">
            {displayText}
          </span>
          <div className="flex items-center gap-1 ml-2">
            {allowClear && selectedValue.length > 0 && (
              <XIcon className="h-4 w-4" onClick={handleClear} />
            )}
            <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" data-slot="cascader-content">
        <CascaderPanel
          options={options}
          selectedPath={selectedValue}
          onSelect={handleSelect}
          onClose={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
    </div>
  );
}

type CascaderPanelProps = {
  options: CascaderOption[];
  selectedPath: string[];
  onSelect: (path: string[], pathOptions: CascaderOption[]) => void;
  onClose: () => void;
};

function CascaderPanel({
  options,
  selectedPath,
  onSelect,
  onClose,
}: CascaderPanelProps) {
  const columns = useMemo(() => {
    const cols: CascaderOption[][] = [options];
    let current = options;

    for (let i = 0; i < selectedPath.length; i++) {
      const found = current.find((opt) => opt.value === selectedPath[i]);
      if (found?.children) {
        cols.push(found.children);
        current = found.children;
      } else {
        break;
      }
    }

    return cols;
  }, [options, selectedPath]);

  const handleItemClick = (item: CascaderOption, depth: number) => {
    const newPath = selectedPath.slice(0, depth).concat(item.value);
    const pathOptions = getPathOptions(options, newPath);

    if (!item.children || item.children.length === 0 || item.leaf) {
      onSelect(newPath, pathOptions);
      onClose();
    }
  };

  return (
    <div className="flex flex-row" data-slot="cascader-panel">
      {columns.map((col, colIndex) => (
        <div
          key={colIndex}
          className="w-36 max-h-64 overflow-y-auto border-r border-border last:border-r-0"
        >
          {col.map((item) => (
            <div
              key={item.value}
              className={cn(
                "px-3 py-2 text-sm cursor-pointer hover:bg-accent flex items-center justify-between",
                selectedPath[colIndex] === item.value && "bg-accent/50 text-foreground",
                item.disabled && "opacity-50 pointer-events-none"
              )}
              onClick={() => !item.disabled && handleItemClick(item, colIndex)}
            >
              <span>{item.label}</span>
              {(item.children || item.leaf === false) && !item.leaf && (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getPathOptions(options: CascaderOption[], path: string[]): CascaderOption[] {
  const result: CascaderOption[] = [];
  let current = options;

  for (const val of path) {
    const found = current.find((opt) => opt.value === val);
    if (found) {
      result.push(found);
      current = found.children || [];
    }
  }

  return result;
}
