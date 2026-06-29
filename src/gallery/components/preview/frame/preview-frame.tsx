import { Copy, RotateCw, Smartphone, Tablet, Monitor } from "lucide-react"
import { type ReactNode, useState, createContext } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { rememberRecentCopy } from "../../../runtime/gallery/recent-copies"

export type PreviewFrameConfig = {
  title: string
  align?: "center" | "start" | "end"
}

type PreviewFrameProps = {
  config: PreviewFrameConfig
  children: ReactNode
  controls?: ReactNode
  className?: string
  copyCode?: string
  copyMeta?: {
    id: string
    title: string
    href: string
  }
}

export const PreviewFrameContext = createContext<{
  width: string | number
  setWidth: (width: string | number) => void
} | null>(null)

export function PreviewFrame({
  config,
  children,
  controls,
  className,
  copyCode,
  copyMeta,
}: PreviewFrameProps) {
  const [reloadKey, setReloadKey] = useState(0)
  const [width, setWidth] = useState<string | number>("100%")

  const handleCopy = async () => {
    if (!copyCode) {
      return
    }

    try {
      await navigator.clipboard.writeText(copyCode)
      if (copyMeta) {
        rememberRecentCopy({ ...copyMeta, importPath: copyCode.slice(0, 120) })
      }
      toast.success("已复制示例代码")
    } catch {
      toast.error("复制失败")
    }
  }

  return (
    <PreviewFrameContext.Provider value={{ width, setWidth }}>
      <div className={cn("group relative my-4", className)}>
        <div className="flex flex-col overflow-visible rounded border border-border/50 bg-background">
          <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/40 bg-muted/20 px-3">
            <span className="flex min-w-0 items-center gap-1.5 font-medium text-xs text-foreground/80">
              <span className="truncate">{config.title}</span>
            </span>
            <div className="flex items-center gap-1">
              {/* Responsive preset buttons */}
              <div className="flex items-center gap-1 border-r border-border/30 pr-2 mr-1">
                <button
                  aria-label="手机视图"
                  className={cn(
                    "flex size-6 items-center justify-center rounded text-muted-foreground transition hover:text-foreground hover:bg-muted/50",
                    width === "375px" && "bg-muted/80 text-foreground font-semibold"
                  )}
                  onClick={() => setWidth("375px")}
                  type="button"
                >
                  <Smartphone className="size-3.5" />
                </button>
                <button
                  aria-label="平板视图"
                  className={cn(
                    "flex size-6 items-center justify-center rounded text-muted-foreground transition hover:text-foreground hover:bg-muted/50",
                    width === "768px" && "bg-muted/80 text-foreground font-semibold"
                  )}
                  onClick={() => setWidth("768px")}
                  type="button"
                >
                  <Tablet className="size-3.5" />
                </button>
                <button
                  aria-label="桌面视图"
                  className={cn(
                    "flex size-6 items-center justify-center rounded text-muted-foreground transition hover:text-foreground hover:bg-muted/50",
                    width === "100%" && "bg-muted/80 text-foreground font-semibold"
                  )}
                  onClick={() => setWidth("100%")}
                  type="button"
                >
                  <Monitor className="size-3.5" />
                </button>
              </div>

              {copyCode ? (
                <button
                  aria-label="复制示例代码"
                  className="flex size-7 items-center justify-center rounded text-muted-foreground opacity-60 hover:opacity-100 hover:bg-muted/50 transition duration-200"
                  onClick={handleCopy}
                  type="button"
                >
                  <Copy className="size-4" />
                </button>
              ) : null}
              <button
                aria-label="刷新预览"
                className="flex size-7 items-center justify-center rounded text-muted-foreground opacity-60 hover:opacity-100 hover:bg-muted/50 transition duration-200"
                onClick={() => setReloadKey((key) => key + 1)}
                type="button"
              >
                <RotateCw
                  className="size-4 transition-transform duration-500 ease-out"
                  style={{ transform: `rotate(${reloadKey * 360}deg)` }}
                />
              </button>
              {controls}
            </div>
          </div>

          <div className="overflow-x-auto bg-background">
            <div className="size-full" key={reloadKey}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </PreviewFrameContext.Provider>
  )
}
