"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check as CheckIcon, Copy as CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useControlledState } from "@/_internals/foundations/hooks/use-controlled-state";
import { Button } from "@/components/core/button";
import type { ComponentProps } from "react";

export type CopyButtonProps = Omit<ComponentProps<typeof Button>, "children"> & {
  content: string;
  copied?: boolean;
  onCopiedChange?: (copied: boolean, content?: string) => void;
  delay?: number;
};

export function CopyButton({
  className,
  content,
  copied,
  onCopiedChange,
  onClick,
  delay = 3000,
  size = "small",
  shape = "square",
  variant = "text",
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useControlledState({
    value: copied,
    onChange: onCopiedChange,
  });

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      if (copied) return;
      if (content) {
        navigator.clipboard
          .writeText(content)
          .then(() => {
            setIsCopied(true);
            onCopiedChange?.(true, content);
            setTimeout(() => {
              setIsCopied(false);
              onCopiedChange?.(false);
            }, delay);
          })
          .catch((error) => {
            console.error("Error copying content", error);
          });
      }
    },
    [onClick, copied, content, setIsCopied, onCopiedChange, delay]
  );

  return (
    <Button
      data-slot="copy-button"
      className={cn(className)}
      onClick={handleCopy}
      size={size}
      shape={shape}
      variant={variant}
      {...props}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={isCopied ? "check" : "copy"}
          data-slot="copy-button-icon"
          initial={{ scale: 0, opacity: 0.4, filter: "blur(4px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          exit={{ scale: 0, opacity: 0.4, filter: "blur(4px)" }}
          transition={{ duration: 0.25 }}
        >
          {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
