import type { BundledLanguage } from "@/components/blocks/code-block"
import { PreviewCode } from "../code"

type CodePaneProps = {
  code: string | null
  filename: string
  language?: BundledLanguage
}

export function CodePane({ code, filename, language = "tsx" }: CodePaneProps) {
  if (!code) {
    return (
      <div className="my-4 rounded border border-border/50 p-3 text-xs text-muted-foreground bg-background">
        源码加载中...
      </div>
    )
  }

  return (
    <div className="my-4">
      <PreviewCode
        code={code}
        filename={filename}
        language={language}
      />
    </div>
  )
}
