import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MentionsOptionType = {
  value: string;
  label?: ReactNode;
};

export type MentionsProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: MentionsOptionType, prefix: string) => void;
  prefix?: string | string[];
  options?: MentionsOptionType[];
  split?: string;
  filterOption?: (input: string, option: MentionsOptionType) => boolean;
  placement?: "top" | "bottom";
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
};

export function Mentions({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSelect,
  prefix = "@",
  options = [],
  split = " ",
  filterOption,
  placement = "bottom",
  rows = 1,
  placeholder,
  disabled = false,
  className,
  maxLength,
}: MentionsProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const inputValue = isControlled ? controlledValue : uncontrolledValue;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mentionInput, setMentionInput] = useState("");
  const [triggerStart, setTriggerStart] = useState(-1);
  const [activePrefix, setActivePrefix] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const prefixes = Array.isArray(prefix) ? prefix : [prefix];

  const filteredOptions = mentionInput
    ? options.filter((option) =>
        filterOption
          ? filterOption(mentionInput, option)
          : (option.label || option.value)
              .toString()
              .toLowerCase()
              .includes(mentionInput.toLowerCase())
      )
    : options;

  const calculateDropdownPosition = useCallback(() => {
    if (!inputRef.current) return;

    const textarea = inputRef.current;
    const { selectionStart } = textarea;

    const textBeforeCursor = inputValue.substring(0, selectionStart);
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];
    const currentLineIndex = lines.length - 1;

    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const top =
      placement === "bottom"
        ? textarea.offsetTop + (currentLineIndex + 1) * lineHeight + 4
        : textarea.offsetTop + currentLineIndex * lineHeight - 4;

    const charWidth = 8;
    const triggerCharIndex = currentLine.lastIndexOf(activePrefix);
    const left =
      textarea.offsetLeft + (triggerCharIndex >= 0 ? triggerCharIndex * charWidth : 0);

    setDropdownPosition({
      top,
      left: Math.max(textarea.offsetLeft, left),
    });
  }, [inputValue, placement, activePrefix]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) return;

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);

      const { selectionStart } = e.target;
      const textBeforeCursor = newValue.substring(0, selectionStart ?? newValue.length);

      let foundPrefix = "";
      let foundIndex = -1;

      for (const p of prefixes) {
        const lastIndex = textBeforeCursor.lastIndexOf(p);
        if (lastIndex !== -1) {
          const afterPrefix = textBeforeCursor.substring(lastIndex + p.length);
          if (!afterPrefix.includes(" ") && !afterPrefix.includes("\n")) {
            foundPrefix = p;
            foundIndex = lastIndex;
            break;
          }
        }
      }

      if (foundIndex !== -1 && foundPrefix) {
        setActivePrefix(foundPrefix);
        setTriggerStart(foundIndex);
        setMentionInput(textBeforeCursor.substring(foundIndex + foundPrefix.length));
        setDropdownVisible(true);
        setActiveIndex(0);
        calculateDropdownPosition();
      } else {
        setDropdownVisible(false);
        setMentionInput("");
        setTriggerStart(-1);
      }
    },
    [isControlled, onChange, maxLength, prefixes, calculateDropdownPosition]
  );

  const handleSelectOption = useCallback(
    (option: MentionsOptionType) => {
      const newValue =
        inputValue.substring(0, triggerStart) +
        activePrefix +
        option.value +
        split +
        inputValue.substring(triggerStart + activePrefix.length + mentionInput.length);

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
      onSelect?.(option, activePrefix);

      setDropdownVisible(false);
      setMentionInput("");
      setTriggerStart(-1);

      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = triggerStart + activePrefix.length + option.value.length + split.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          inputRef.current.focus();
        }
      }, 0);
    },
    [inputValue, triggerStart, activePrefix, mentionInput, split, isControlled, onChange, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!dropdownVisible || filteredOptions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelectOption(filteredOptions[activeIndex]);
      } else if (e.key === "Escape") {
        setDropdownVisible(false);
      }
    },
    [dropdownVisible, filteredOptions, activeIndex, handleSelectOption]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" data-slot="mentions">
      {rows === 1 ? (
        <input
          ref={inputRef as any}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
      ) : (
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            className
          )}
        />
      )}

      {dropdownVisible && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-56 rounded-md border border-border bg-popover shadow-md overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
          data-slot="mentions-dropdown"
        >
          {filteredOptions.map((option, index) => (
            <div
              key={option.value}
              className={cn(
                "px-3 py-1.5 text-sm cursor-pointer",
                index === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent"
              )}
              onClick={() => handleSelectOption(option)}
            >
              {option.label || option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
