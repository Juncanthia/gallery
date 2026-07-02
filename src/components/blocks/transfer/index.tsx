import { useState, useMemo, type ReactNode } from "react";
import { cn } from "@/_internals/foundations/utils/cn";
import { Button } from "@/components/core/button";
import { Checkbox } from "@/components/core/checkbox";
import { Input } from "@/components/core/input";
import { ScrollArea } from "@/components/core/scroll-area";
import { ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon } from "lucide-react";

export type TransferItem = {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

export type TransferProps = {
  dataSource: TransferItem[];
  targetKeys?: string[];
  defaultTargetKeys?: string[];
  onChange?: (targetKeys: string[], direction: "left" | "right", moveKeys: string[]) => void;
  titles?: [string, string];
  showSearch?: boolean;
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  render?: (item: TransferItem) => ReactNode;
  disabled?: boolean;
  oneWay?: boolean;
  className?: string;
};

export function Transfer({
  dataSource,
  targetKeys: controlledTargetKeys,
  defaultTargetKeys = [],
  onChange,
  titles = ["Source", "Target"],
  showSearch = false,
  filterOption,
  render,
  disabled = false,
  oneWay = false,
  className,
}: TransferProps) {
  const isControlled = controlledTargetKeys !== undefined;
  const [uncontrolledTargetKeys, setUncontrolledTargetKeys] = useState<string[]>(
    defaultTargetKeys
  );
  const targetKeys = isControlled ? controlledTargetKeys : uncontrolledTargetKeys;

  const [leftSearchValue, setLeftSearchValue] = useState("");
  const [rightSearchValue, setRightSearchValue] = useState("");
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const sourceItems = useMemo(
    () => dataSource.filter((item) => !targetKeys.includes(item.key)),
    [dataSource, targetKeys]
  );

  const targetItems = useMemo(
    () => dataSource.filter((item) => targetKeys.includes(item.key)),
    [dataSource, targetKeys]
  );

  const filteredSourceItems = useMemo(() => {
    if (!showSearch || !leftSearchValue) return sourceItems;
    return sourceItems.filter((item) =>
      filterOption
        ? filterOption(leftSearchValue, item)
        : item.title.toLowerCase().includes(leftSearchValue.toLowerCase())
    );
  }, [sourceItems, leftSearchValue, showSearch, filterOption]);

  const filteredTargetItems = useMemo(() => {
    if (!showSearch || !rightSearchValue) return targetItems;
    return targetItems.filter((item) =>
      filterOption
        ? filterOption(rightSearchValue, item)
        : item.title.toLowerCase().includes(rightSearchValue.toLowerCase())
    );
  }, [targetItems, rightSearchValue, showSearch, filterOption]);

  const handleTransfer = (direction: "left" | "right") => {
    const sourceChecked = direction === "right" ? leftChecked : rightChecked;
    const newTargetKeys =
      direction === "right"
        ? [...targetKeys, ...sourceChecked]
        : targetKeys.filter((key) => !sourceChecked.includes(key));

    if (!isControlled) {
      setUncontrolledTargetKeys(newTargetKeys);
    }
    onChange?.(newTargetKeys, direction, sourceChecked);

    if (direction === "right") {
      setLeftChecked([]);
    } else {
      setRightChecked([]);
    }
  };

  const leftAllChecked =
    filteredSourceItems.length > 0 &&
    filteredSourceItems.every((item) => leftChecked.includes(item.key) || item.disabled);
  const rightAllChecked =
    filteredTargetItems.length > 0 &&
    filteredTargetItems.every((item) => rightChecked.includes(item.key) || item.disabled);

  const toggleLeftAll = () => {
    if (leftAllChecked) {
      setLeftChecked(
        leftChecked.filter(
          (key) =>
            !filteredSourceItems.map((item) => item.key).includes(key) ||
            filteredSourceItems.find((item) => item.key === key)?.disabled
        )
      );
    } else {
      setLeftChecked([
        ...leftChecked,
        ...filteredSourceItems
          .filter((item) => !item.disabled && !leftChecked.includes(item.key))
          .map((item) => item.key),
      ]);
    }
  };

  const toggleRightAll = () => {
    if (rightAllChecked) {
      setRightChecked(
        rightChecked.filter(
          (key) =>
            !filteredTargetItems.map((item) => item.key).includes(key) ||
            filteredTargetItems.find((item) => item.key === key)?.disabled
        )
      );
    } else {
      setRightChecked([
        ...rightChecked,
        ...filteredTargetItems
          .filter((item) => !item.disabled && !rightChecked.includes(item.key))
          .map((item) => item.key),
      ]);
    }
  };

  return (
    <div className={cn("flex flex-row gap-4 items-center", className)} data-slot="transfer">
      <TransferPanel
        title={titles[0]}
        items={filteredSourceItems}
        checked={leftChecked}
        onCheck={setLeftChecked}
        onCheckAll={toggleLeftAll}
        allChecked={leftAllChecked}
        searchValue={leftSearchValue}
        onSearchChange={setLeftSearchValue}
        showSearch={showSearch}
        render={render}
        disabled={disabled}
        allItems={sourceItems}
      />

      <div className="flex flex-col gap-2">
        <Button
          shape="square"
          variant="outlined"
          disabled={!oneWay && (disabled || leftChecked.length === 0)}
          onClick={() => handleTransfer("right")}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        {!oneWay && (
          <Button
            shape="square"
            variant="outlined"
            disabled={disabled || rightChecked.length === 0}
            onClick={() => handleTransfer("left")}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <TransferPanel
        title={titles[1]}
        items={filteredTargetItems}
        checked={rightChecked}
        onCheck={setRightChecked}
        onCheckAll={toggleRightAll}
        allChecked={rightAllChecked}
        searchValue={rightSearchValue}
        onSearchChange={setRightSearchValue}
        showSearch={showSearch}
        render={render}
        disabled={disabled}
        allItems={targetItems}
      />
    </div>
  );
}

type TransferPanelProps = {
  title: string;
  items: TransferItem[];
  checked: string[];
  onCheck: (checked: string[]) => void;
  onCheckAll: () => void;
  allChecked: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showSearch: boolean;
  render?: (item: TransferItem) => ReactNode;
  disabled: boolean;
  allItems: TransferItem[];
};

function TransferPanel({
  title,
  items,
  checked,
  onCheck,
  onCheckAll,
  allChecked,
  searchValue,
  onSearchChange,
  showSearch,
  render,
  disabled,
  allItems,
}: TransferPanelProps) {
  const handleToggle = (key: string) => {
    if (checked.includes(key)) {
      onCheck(checked.filter((k) => k !== key));
    } else {
      onCheck([...checked, key]);
    }
  };

  return (
    <div className="flex flex-col w-full border border-border rounded-md overflow-hidden" data-slot="transfer-panel">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-muted/30">
        <Checkbox
          checked={
            allChecked ? true : allItems.some((item) => checked.includes(item.key)) ? "indeterminate" : false
          }
          onCheckedChange={onCheckAll}
          disabled={disabled}
        />
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">
          {checked.length}/{allItems.length}
        </span>
      </div>

      {showSearch && (
        <div className="px-2 py-2 border-b border-border">
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}

      <ScrollArea className="flex-1 min-h-40">
        <div>
          {items.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No items
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer",
                  item.disabled && "opacity-50 pointer-events-none"
                )}
                onClick={() => !item.disabled && handleToggle(item.key)}
              >
                <Checkbox
                  checked={checked.includes(item.key)}
                  onCheckedChange={() => handleToggle(item.key)}
                  disabled={item.disabled}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">
                    {render ? render(item) : item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
