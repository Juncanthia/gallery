"use client";

import type { Action } from "./schema";
import type { ButtonColor, ButtonVariant } from "./_adapter";
import { cn, Button } from "./_adapter";
import { useActionButtons } from "./use-action-buttons";

// `Action.variant` uses the shadcn-style enum for portability across projects
// (see ./schema); map it to this project's antd-style Button variant/color.
function toButtonVisual(
  variant: Action["variant"],
): { variant: ButtonVariant; color?: ButtonColor } {
  switch (variant) {
    case "destructive":
      return { variant: "solid", color: "danger" };
    case "secondary":
      return { variant: "filled" };
    case "ghost":
      return { variant: "text" };
    case "outline":
      return { variant: "outlined" };
    case "default":
    default:
      return { variant: "solid" };
  }
}

export interface ActionButtonsProps {
  actions: Action[];
  onAction: (actionId: string) => void | Promise<void>;
  onBeforeAction?: (actionId: string) => boolean | Promise<boolean>;
  confirmTimeout?: number;
  align?: "left" | "center" | "right";
  className?: string;
}

export function ActionButtons({
  actions,
  onAction,
  onBeforeAction,
  confirmTimeout = 3000,
  align = "right",
  className,
}: ActionButtonsProps) {
  const { actions: resolvedActions, runAction } = useActionButtons({
    actions,
    onAction,
    onBeforeAction,
    confirmTimeout,
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        "@sm/actions:flex-row @sm/actions:flex-wrap @sm/actions:items-center @sm/actions:gap-2",
        align === "left" && "@sm/actions:justify-start",
        align === "center" && "@sm/actions:justify-center",
        align === "right" && "@sm/actions:justify-end",
        className,
      )}
    >
      {resolvedActions.map((action) => {
        const label = action.currentLabel;
        const { variant, color } = toButtonVisual(action.variant);

        return (
          <Button
            key={action.id}
            variant={variant}
            color={color}
            onClick={() => runAction(action.id)}
            disabled={action.isDisabled}
            className={cn(
              "rounded-full px-4!",
              "justify-center",
              "min-h-11 w-full text-base",
              "@sm/actions:min-h-0 @sm/actions:w-auto @sm/actions:px-3 @sm/actions:py-2 @sm/actions:text-sm",
              action.isConfirming &&
                "ring-destructive ring-2 ring-offset-2 motion-safe:animate-pulse",
            )}
            aria-label={
              action.shortcut ? `${label} (${action.shortcut})` : label
            }
          >
            {action.isLoading && (
              <svg
                className="mr-2 h-4 w-4 motion-safe:animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {action.icon && !action.isLoading && (
              <span className="mr-2">{action.icon}</span>
            )}
            {label}
            {action.shortcut && !action.isLoading && (
              <kbd className="border-border bg-muted ml-2.5 hidden rounded-lg border px-2 py-0.5 font-mono text-xs font-medium sm:inline-block">
                {action.shortcut}
              </kbd>
            )}
          </Button>
        );
      })}
    </div>
  );
}
