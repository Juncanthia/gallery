"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { type LucideProps, StarIcon } from "lucide-react";
import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type RatingSize = "sm" | "default" | "lg";
type RatingOrientation = "horizontal" | "vertical";
type RatingStep = 0.5 | 1;

type RatingContextValue = {
  value: number;
  max: number;
  step: RatingStep;
  size: RatingSize;
  disabled: boolean;
  readOnly: boolean;
  clearable: boolean;
  hoverValue: number | null;
  focusedStar: number | null;
  handleValueChange: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  setHoverValue: (value: number | null) => void;
  setFocusedStar: (value: number | null) => void;
};

const RatingContext = createContext<RatingContextValue | null>(null);

const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error("useRating must be used within a Rating component");
  }
  return context;
};

export type RatingButtonProps = LucideProps & {
  index?: number;
  disabled?: boolean;
  icon?: ReactElement<LucideProps>;
};

const ratingSizeClasses: Record<RatingSize, string> = {
  sm: "size-4",
  default: "size-5",
  lg: "size-6",
};

const getValueFromPointer = (
  event: MouseEvent<HTMLButtonElement>,
  itemValue: number,
  step: RatingStep
) => {
  if (step === 1) {
    return itemValue;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;

  return pointerX < rect.width / 2 ? itemValue - step : itemValue;
};

export const RatingButton = ({
  index: providedIndex,
  size,
  disabled,
  className,
  icon = <StarIcon />,
}: RatingButtonProps) => {
  const {
    value,
    step,
    size: ratingSize,
    disabled: rootDisabled,
    readOnly,
    clearable,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  } = useRating();

  const index = providedIndex ?? 0;
  const itemValue = index + 1;
  const displayValue = hoverValue ?? focusedStar ?? value ?? 0;
  const isDisabled = rootDisabled || !!disabled;
  const isReadOnly = readOnly || isDisabled;
  const isFull = displayValue >= itemValue;
  const isPartial =
    step === 0.5 && displayValue >= itemValue - step && displayValue < itemValue;
  let tabIndex = -1;

  if (!isReadOnly) {
    tabIndex =
      (value > 0 && Math.ceil(value) === itemValue) ||
      (value === 0 && itemValue === 1)
        ? 0
        : -1;
  }

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const nextValue = getValueFromPointer(event, itemValue, step);
      handleValueChange(event, clearable && value === nextValue ? 0 : nextValue);
    },
    [clearable, handleValueChange, itemValue, step, value]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!isReadOnly) {
        setHoverValue(getValueFromPointer(event, itemValue, step));
      }
    },
    [isReadOnly, itemValue, setHoverValue, step]
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!isReadOnly) {
        setHoverValue(getValueFromPointer(event, itemValue, step));
      }
    },
    [isReadOnly, itemValue, setHoverValue, step]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isReadOnly && step === 0.5) {
      setHoverValue(null);
    }
  }, [isReadOnly, setHoverValue, step]);

  const handleFocus = useCallback(() => {
    setFocusedStar(itemValue);
  }, [itemValue, setFocusedStar]);

  const handleBlur = useCallback(() => {
    setFocusedStar(null);
  }, [setFocusedStar]);

  const iconSize = size ?? (ratingSize === "sm" ? 16 : ratingSize === "lg" ? 24 : 20);

  return (
    <button
      aria-checked={isFull || isPartial}
      className={cn(
        "inline-flex items-center justify-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "p-0.5 transition-colors disabled:pointer-events-none disabled:opacity-50",
        ratingSizeClasses[ratingSize],
        isReadOnly ? "cursor-default" : "cursor-pointer",
        className
      )}
      data-state={isFull ? "full" : isPartial ? "partial" : "empty"}
      disabled={isDisabled}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      role="radio"
      tabIndex={tabIndex}
      type="button"
    >
      <span className="relative inline-flex size-full">
        {cloneElement(icon, {
          size: iconSize,
          className: cn(
            "size-full transition-colors duration-200",
            isFull ? "fill-current" : "fill-transparent",
            !isReadOnly && "cursor-pointer"
          ),
          "aria-hidden": "true",
        })}
        {isPartial ? (
          <span className="pointer-events-none absolute inset-0 w-1/2 overflow-hidden">
            {cloneElement(icon, {
              size: iconSize,
              className: "h-full w-[200%] fill-current transition-colors duration-200",
              "aria-hidden": "true",
            })}
          </span>
        ) : null}
      </span>
    </button>
  );
};

export type RatingProps = Omit<ComponentProps<"div">, "onChange"> & {
  defaultValue?: number;
  value?: number;
  onChange?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  onValueChange?: (value: number) => void;
  max?: number;
  count?: number;
  step?: RatingStep;
  allowHalf?: boolean;
  size?: RatingSize;
  orientation?: RatingOrientation;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  children?: ReactNode;
};

export const Rating = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue = 0,
  onChange,
  max,
  count,
  step: providedStep,
  allowHalf = false,
  size = "default",
  orientation = "horizontal",
  clearable = false,
  disabled = false,
  readOnly = false,
  className,
  children,
  ...props
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [focusedStar, setFocusedStar] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue,
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });
  const step = providedStep ?? (allowHalf ? 0.5 : 1);
  const generatedCount = count ?? max ?? 5;
  const itemCount = children ? Children.count(children) : generatedCount;
  const isReadOnly = readOnly || disabled;

  const handleValueChange = useCallback(
    (
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
      newValue: number
    ) => {
      if (!isReadOnly) {
        const normalizedValue = Math.min(itemCount, Math.max(0, newValue));
        onChange?.(event, normalizedValue);
        onValueChange?.(normalizedValue);
      }
    },
    [isReadOnly, itemCount, onChange, onValueChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (isReadOnly) {
        return;
      }

      let newValue = focusedStar !== null ? focusedStar : (value ?? 0);

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          if (event.shiftKey || event.metaKey) {
            newValue = itemCount;
          } else {
            newValue = Math.min(itemCount, newValue + step);
          }
          break;
        case "ArrowLeft":
        case "ArrowUp":
          if (event.shiftKey || event.metaKey) {
            newValue = step;
          } else {
            newValue = Math.max(step, newValue - step);
          }
          break;
        case "Home":
          newValue = clearable ? 0 : step;
          break;
        case "End":
          newValue = itemCount;
          break;
        default:
          return;
      }

      event.preventDefault();
      setFocusedStar(Math.ceil(newValue));
      handleValueChange(event, newValue);
    },
    [clearable, focusedStar, handleValueChange, isReadOnly, itemCount, step, value]
  );

  useEffect(() => {
    if (focusedStar !== null && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll("button");
      buttons[focusedStar - 1]?.focus();
    }
  }, [focusedStar]);

  const contextValue: RatingContextValue = {
    value: value ?? 0,
    max: itemCount,
    step,
    size,
    disabled,
    readOnly,
    clearable,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  };

  return (
    <RatingContext.Provider value={contextValue}>
      <div
        aria-label="Rating"
        aria-orientation={orientation}
        className={cn(
          "inline-flex gap-0.5",
          orientation === "vertical" ? "flex-col items-start" : "items-center",
          className
        )}
        data-disabled={disabled ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-slot="rating"
        onMouseLeave={() => setHoverValue(null)}
        ref={containerRef}
        role="radiogroup"
        {...props}
      >
        {Children.map(
          children ??
            Array.from({ length: itemCount }, (_, index) => (
              <RatingButton key={index} />
            )),
          (child, index) => {
          if (!child) {
            return null;
          }

          return cloneElement(child as ReactElement<RatingButtonProps>, {
            index,
          });
          }
        )}
      </div>
    </RatingContext.Provider>
  );
};

export type { RatingOrientation, RatingSize, RatingStep };
export { useRating };
