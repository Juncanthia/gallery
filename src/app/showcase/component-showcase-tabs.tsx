import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/core/tabs"
import { useState, type ReactNode } from "react"
import { Code2, FileCode2 } from "lucide-react"
import { cn } from "@/kit/utils"

type ComponentShowcaseTabsProps = {
  anchor: string
  preview: ReactNode
  code: ReactNode
  source?: ReactNode
}

export function ComponentShowcaseTabs({
  anchor,
  preview,
  code,
  source,
}: ComponentShowcaseTabsProps) {
  const [activeTab, setActiveTab] = useState("code")

  return (
    <div className="w-full space-y-4">
      {/* 1. 预览单独展示 */}
      <div className="scroll-mt-28" id={`${anchor}-preview`}>
        {preview}
      </div>

      {/* 2. 代码/源码区域 */}
      {code && source ? (
        <div className="space-y-3">
          <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <TabsList className="h-8 p-0.5 bg-muted/40 dark:bg-muted/20">
                <TabsTrigger
                  value="code"
                  className={cn(
                    "h-7 px-3 text-xs gap-1.5 transition-all duration-300",
                    activeTab === "code" && "text-indigo-600 dark:text-indigo-400 font-semibold"
                  )}
                >
                  <Code2 className={cn("size-3.5 transition-colors", activeTab === "code" ? "text-indigo-500" : "text-muted-foreground/60")} />
                  <span>代码</span>
                </TabsTrigger>
                <TabsTrigger
                  value="source"
                  className={cn(
                    "h-7 px-3 text-xs gap-1.5 transition-all duration-300",
                    activeTab === "source" && "text-amber-600 dark:text-amber-500 font-semibold"
                  )}
                >
                  <FileCode2 className={cn("size-3.5 transition-colors", activeTab === "source" ? "text-amber-500" : "text-muted-foreground/60")} />
                  <span>源码</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent className="mt-3 outline-none" value="code">
              <div className="scroll-mt-28" id={`${anchor}-code`}>
                {code}
              </div>
            </TabsContent>

            <TabsContent className="mt-3 scroll-mt-28 data-[state=inactive]:hidden outline-none" forceMount id={`${anchor}-source`} value="source">
              {source}
            </TabsContent>
          </Tabs>
        </div>
      ) : source ? (
        <div className="scroll-mt-28" id={`${anchor}-source`}>
          {source}
        </div>
      ) : code ? (
        <div className="scroll-mt-28" id={`${anchor}-code`}>
          {code}
        </div>
      ) : null}
    </div>
  )
}
