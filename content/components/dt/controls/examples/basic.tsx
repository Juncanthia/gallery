"use client"

import { ControlsProvider } from "@/components/ui/dt-controls"
import { useControls } from "@/components/data-table-filters/components/controls"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

function ControlsToggle() {
  const { open, setOpen } = useControls()

  return (
    <Button
      variant="outlined"
      icon={open ? <ChevronDown /> : <ChevronRight />}
      onClick={() => setOpen(!open)}
    >
      {open ? "收起筛选" : "展开筛选"}
    </Button>
  )
}

function FilterPanel() {
  const { open } = useControls()

  if (!open) return null

  return (
    <div className="mt-3 space-y-3 rounded-md border bg-muted/30 p-4">
      <p className="text-sm font-medium">筛选条件</p>
      <p className="text-xs text-muted-foreground">
        筛选控件内容区，通过 ControlsProvider 的 open 状态控制显隐。
      </p>
    </div>
  )
}

export default function Demo() {
  return (
    <ControlsProvider>
      <div className="w-full max-w-sm">
        <ControlsToggle />
        <FilterPanel />
      </div>
    </ControlsProvider>
  )
}
