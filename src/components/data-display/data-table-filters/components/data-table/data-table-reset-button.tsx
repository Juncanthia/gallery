"use client";

import { useDataTable } from "@/components/data-display/data-table-filters/components/data-table/data-table-provider";
import { Button } from "@/components/core/button";
import { Kbd } from "@/components/core/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/core/tooltip";
import { useHotKey } from "@/_internals/domains/data-table/hooks/use-hot-key";
import { X } from "lucide-react";

export function DataTableResetButton() {
  const { table } = useDataTable();
  useHotKey(table.resetColumnFilters, "Escape");

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button variant="text" onClick={() => table.resetColumnFilters()}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-nowrap">
            Reset filters with{" "}
            <Kbd className="text-muted-foreground group-hover:text-accent-foreground ml-1">
              <span className="mr-1">⌘</span>
              <span>Esc</span>
            </Kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
