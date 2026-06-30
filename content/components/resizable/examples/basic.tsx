import { Resizable, ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function ResizableBasicExample() {
  return (
    <div className="w-full max-w-md">
      <ResizablePanelGroup direction="horizontal" className="min-h-32 rounded border">
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="flex h-full items-center justify-center bg-muted/30 p-4 text-sm">
            左侧面板
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="flex h-full items-center justify-center bg-muted/10 p-4 text-sm">
            右侧面板
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
