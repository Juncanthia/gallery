import { Copy } from "lucide-react"
import { toast } from "sonner"

import { rememberRecentCopy } from "../../../runtime/gallery/recent-copies"

type ImportCopierProps = {
  importPath: string
  copyMeta?: {
    id: string
    title: string
    href: string
  }
}

export function ImportCopier({ importPath, copyMeta }: ImportCopierProps) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-xs">
      <code className="rounded bg-muted/60 px-1.5 py-0.5 text-foreground/90 select-all">{importPath}</code>
      <button
        className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(importPath)
            if (copyMeta) {
              rememberRecentCopy({ ...copyMeta, importPath })
            }
            toast.success("已复制导入路径")
          } catch {
            toast.error("复制失败")
          }
        }}
        title="复制导入路径"
        type="button"
      >
        <Copy className="size-3.5" />
      </button>
    </div>
  )
}
