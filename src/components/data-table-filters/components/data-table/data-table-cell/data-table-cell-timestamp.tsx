"use client";

import { format, formatDistanceToNowStrict } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@hyper/shadcn";

export function DataTableCellTimestamp({
  date,
  color,
}: {
  date: Date | string | number;
  color?: string;
}) {
  const d = date instanceof Date ? date : new Date(date);
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <span className="font-mono whitespace-nowrap" style={color ? { color } : undefined}>
          {format(d, "LLL dd, y HH:mm:ss")}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="z-10 w-auto p-2">
        <dl className="flex flex-col gap-1 text-sm">
          <div className="text-muted-foreground text-xs">Timestamp</div>
          <div className="font-mono">{String(d.getTime())}</div>
          <div className="text-muted-foreground text-xs mt-1">Relative</div>
          <div className="font-mono">{formatDistanceToNowStrict(d, { addSuffix: true })}</div>
        </dl>
      </HoverCardContent>
    </HoverCard>
  );
}
