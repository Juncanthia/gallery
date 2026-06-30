import { PdfBlockResizableShell } from "@/components/ui/extend-pdf-block-resizable-shell"

export default function Demo() {
  return (
    <PdfBlockResizableShell
      autoSaveId="pdf-block-resizable-shell-demo"
      left={
        <div className="flex h-full items-center justify-center bg-muted/30">
          <div className="text-center">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-sm font-medium text-foreground">文档预览区</p>
            <p className="text-xs text-muted-foreground mt-1">
              放置 PDFViewer 或其他文档组件
            </p>
          </div>
        </div>
      }
      right={
        <div className="flex h-full flex-col bg-background p-4">
          <h3 className="text-sm font-semibold mb-3">信息面板</h3>
          <div className="flex-1 space-y-3">
            <div className="rounded-md border p-3">
              <p className="text-xs font-medium">文件名</p>
              <p className="text-sm text-muted-foreground">document.pdf</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs font-medium">页数</p>
              <p className="text-sm text-muted-foreground">12 页</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs font-medium">大小</p>
              <p className="text-sm text-muted-foreground">2.4 MB</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            拖拽中间分隔条可调整面板宽度
          </p>
        </div>
      }
    />
  )
}
