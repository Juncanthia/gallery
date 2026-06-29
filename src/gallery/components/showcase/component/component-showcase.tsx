import { Library, ShieldCheck, Terminal } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"

import { CodePane } from "../../preview/panes/code-pane"
import { PreviewPane } from "../../preview/panes/preview-pane"
import { SourcePane } from "../../preview/panes/source-pane"
import { libraryBySourceId } from "../../../lib/catalog/data/libraries"
import { statusLabel } from "../../../lib/catalog/labels"
import type { GalleryItem } from "../../../lib/catalog/types"
import type { PreviewSourceId } from "../../../lib/preview/asset"
import {
  resolveShowcase,
  type ShowcaseModel,
} from "../../../lib/showcase/model/resolve-showcase"
import { ComponentShowcaseTabs } from "../tabs/preview-code-tabs"
import { ApiSection } from "./component-api-section"
import { ImportCopier } from "./import-copier"
import { MissingPreview } from "./missing-preview"

type ComponentShowcaseProps = {
  id?: string
  path: string
  source?: PreviewSourceId | "local"
  title?: string
}

function SourceInfo({
  item,
  selectedSource,
}: {
  item: GalleryItem | null
  selectedSource: string
}) {
  if (!item) {
    return (
      <div className="text-muted-foreground text-xs leading-relaxed">
        未找到组件目录元信息，仅展示当前示例源码。
      </div>
    )
  }

  const impl = item.implementations.find((implementation) => implementation.source === selectedSource)

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground py-1">
      <div className="flex items-center gap-1.5">
        <Library className="size-3.5 text-muted-foreground/60" />
        <span>来源库:</span>
        <span className="font-medium text-foreground">
          {libraryBySourceId(selectedSource)?.sidebarName ?? selectedSource}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <ShieldCheck className="size-3.5 text-muted-foreground/60" />
        <span>状态:</span>
        <span className="font-medium text-foreground">{statusLabel(impl?.status)}</span>
      </div>

      {impl?.importPath ? (
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-muted-foreground/60" />
          <span>导入路径:</span>
          <ImportCopier
            copyMeta={item ? { id: item.id, title: item.title, href: item.href } : undefined}
            importPath={impl.importPath}
          />
        </div>
      ) : null}
    </div>
  )
}

const SECTION_HEADING = "mb-4 font-semibold text-foreground text-base tracking-tight"

export function ComponentShowcase({ id, path, source }: ComponentShowcaseProps) {
  const [model, setModel] = useState<ShowcaseModel | null>(null)

  useEffect(() => {
    let disposed = false

    resolveShowcase(path, source, id).then((nextModel) => {
      if (!disposed) {
        setModel(nextModel)
      }
    })

    return () => {
      disposed = true
    }
  }, [id, path, source])

  const isDev = import.meta.env.DEV
  const anchor = model?.anchor ?? id ?? path.replaceAll("/", "-")
  const asset = model?.asset ?? null
  const item = model?.item ?? null
  const selectedSource = model?.selectedSource ?? "local"
  const apiDoc = model?.apiDoc ?? null
  const relatedPatterns = model?.relatedPatterns ?? []
  const has = model?.has ?? {
    preview: false,
    api: false,
    examples: false,
    source: false,
  }
  const copyMeta = item ? { id: item.id, title: item.title, href: item.href } : undefined

  const previewContent = has.preview && asset ? (
    <PreviewPane
      copyCode={asset.parsedCode}
      copyMeta={copyMeta}
      frame={asset.frame}
      type={asset.type}
    >
      <asset.Preview />
    </PreviewPane>
  ) : isDev && model ? (
    <MissingPreview path={path} />
  ) : (
    <div className="rounded border border-border/50 p-3 text-muted-foreground text-xs">
      示例加载中...
    </div>
  )

  const codeContent = has.preview && asset ? (
    <CodePane code={asset.parsedCode} filename={asset.filename} />
  ) : null

  const sourceContent = has.source && asset ? (
    <div className="space-y-4">
      <SourceInfo item={item} selectedSource={selectedSource} />
      <SourcePane files={asset.sourceFiles} />
    </div>
  ) : null

  return (
    <div className="not-prose my-8 scroll-mt-28 space-y-8 font-sans text-sm" id={anchor}>
      <ComponentShowcaseTabs
        anchor={anchor}
        code={codeContent}
        preview={previewContent}
        source={has.source ? sourceContent : undefined}
      />

      {has.api ? (
        <section className="scroll-mt-28" id={`${anchor}-api`}>
          <h3 className={SECTION_HEADING}>API</h3>
          <ApiSection doc={apiDoc} />
        </section>
      ) : null}

      {isDev && item && item.kind === "component" && !apiDoc ? (
        <section className="scroll-mt-28" id={`${anchor}-api`}>
          <h3 className={SECTION_HEADING}>API</h3>
          <ApiSection doc={null} missingInDev />
        </section>
      ) : null}

      {has.examples && relatedPatterns.length > 0 ? (
        <section className="scroll-mt-28" id={`${anchor}-examples`}>
          <h3 className={SECTION_HEADING}>示例 Examples</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedPatterns.map((pattern) => (
              <Link
                className="flex flex-col gap-1 rounded border border-border/50 bg-muted/10 p-3 transition-colors hover:bg-muted/30"
                key={pattern.id}
                to={pattern.href}
              >
                <h4 className="font-semibold text-foreground text-xs">{pattern.title}</h4>
                <p className="line-clamp-2 text-muted-foreground text-[11px] leading-relaxed">
                  {pattern.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
