"use client";

import {
  type ComponentProps,
  type HTMLAttributes,
} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/core/tabs";
import { CopyButton } from "@/components/core/copy-button";
import { cn } from "@/_internals/foundations/utils/cn";

export type SnippetProps = ComponentProps<typeof Tabs>;

export const Snippet = ({ className, ...props }: SnippetProps) => (
  <Tabs
    className={cn(
      "group w-full gap-0 overflow-hidden rounded-md border",
      className
    )}
    {...props}
  />
);

export type SnippetHeaderProps = HTMLAttributes<HTMLDivElement>;

export const SnippetHeader = ({ className, ...props }: SnippetHeaderProps) => (
  <div
    className={cn(
      "flex flex-row items-center justify-between border-b bg-secondary p-1",
      className
    )}
    {...props}
  />
);

export type SnippetCopyButtonProps = ComponentProps<typeof CopyButton> & {
  value?: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const SnippetCopyButton = ({
  value = "",
  onCopy,
  timeout = 2000,
  className,
  ...props
}: SnippetCopyButtonProps) => (
  <CopyButton
    size="small" shape="square"
    variant="text"
    {...props}
    className={cn("opacity-0 transition-opacity group-hover:opacity-100", className)}
    content={value}
    delay={timeout}
    onCopiedChange={(copied) => {
      if (copied) onCopy?.();
    }}
  />
);

export type SnippetTabsListProps = ComponentProps<typeof TabsList>;

export const SnippetTabsList = TabsList;

export type SnippetTabsTriggerProps = ComponentProps<typeof TabsTrigger>;

export const SnippetTabsTrigger = ({
  className,
  ...props
}: SnippetTabsTriggerProps) => (
  <TabsTrigger className={cn("gap-1.5", className)} {...props} />
);

export type SnippetTabsContentProps = ComponentProps<typeof TabsContent>;

export const SnippetTabsContent = ({
  className,
  children,
  ...props
}: SnippetTabsContentProps) => (
  <TabsContent
    asChild
    className={cn("mt-0 bg-background p-4 text-sm", className)}
    {...props}
  >
    <pre className="truncate">{children}</pre>
  </TabsContent>
);
