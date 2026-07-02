import {
  isValidElement,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactNode,
} from "react"
import type { MDXComponents, MDXProps } from "mdx/types"

import type { BundledLanguage } from "@/components/blocks/code-block"
import { GALLERY_DOCS } from "../registry/catalog"
import { MdxDocPage } from "./mdx-doc-page"
import { PreviewCode } from "../showcase/preview/code"
import { ComponentShowcase } from "../showcase/component-showcase"
import { SourceViewer } from "../showcase/source-viewer"
import { loadComponentMdx } from "../runtime/mdx-registry"

type ComponentDocPageProps = {
  slug: string
}

type PageState = {
  slug: string
  Page: ComponentType<MDXProps> | null
  missing: boolean
}

type MdxCodeElementProps = {
  className?: string
  children?: ReactNode
}

function textContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return ""
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map(textContent).join("")
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textContent(node.props.children)
  }

  return ""
}

function filenameForLanguage(language: string) {
  if (language === "tsx") {
    return "example.tsx"
  }

  if (language === "jsx") {
    return "example.jsx"
  }

  if (language === "ts") {
    return "example.ts"
  }

  if (language === "js") {
    return "example.js"
  }

  return `example.${language}`
}

function MdxPre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  if (isValidElement<MdxCodeElementProps>(children)) {
    const className = children.props.className ?? ""
    const language = className.match(/language-([a-z0-9-]+)/i)?.[1] ?? "tsx"
    const code = textContent(children.props.children).replace(/\n$/, "")

    return (
      <div className="not-prose my-4">
        <PreviewCode
          code={code}
          filename={filenameForLanguage(language)}
          language={language as BundledLanguage}
        />
      </div>
    )
  }

  return <pre {...props}>{children}</pre>
}

const mdxComponents: MDXComponents = {
  ComponentShowcase,
  SourceViewer,
  h1: (props) => <h1 className="sr-only" {...props} />,
  pre: MdxPre,
}

export function ComponentDocPage({ slug }: ComponentDocPageProps) {
  const meta = GALLERY_DOCS[slug]
  const [pageState, setPageState] = useState<PageState>({
    slug: "",
    Page: null,
    missing: false,
  })

  useEffect(() => {
    let disposed = false

    loadComponentMdx(slug).then((MdxPage) => {
      if (disposed) {
        return
      }

      if (!MdxPage) {
        setPageState({
          slug,
          Page: null,
          missing: true,
        })
        return
      }

      setPageState({
        slug,
        Page: MdxPage,
        missing: false,
      })
    })

    return () => {
      disposed = true
    }
  }, [slug])

  const isLoading = pageState.slug !== slug
  const Page = isLoading ? null : pageState.Page
  const missing = !isLoading && pageState.missing
  const toc = meta?.toc.map((item) => ({
    depth: item.depth,
    title: item.title,
    url: `#${item.id}`,
  }))

  if (missing) {
    return (
      <MdxDocPage
        description={meta?.description ?? "该组件已进入 Ant Design 分类导航，展示内容待补齐。"}
        title={
          <span className="inline-flex items-baseline gap-2">
            <span>{meta?.title ?? slug}</span>
            {meta?.en ? <span className="text-sm text-muted-foreground">{meta.en}</span> : null}
          </span>
        }
        toc={[]}
        tocVariant="tocn"
      >
        <div className="not-prose rounded border border-dashed border-border/60 bg-background/80 p-4 text-sm text-muted-foreground">
          当前组件还没有 MDX 展示内容；左侧导航已先按 Ant Design 分类接入。
        </div>
      </MdxDocPage>
    )
  }

  if (!Page) {
    return (
      <div className="rounded border border-border/60 bg-card p-4 text-sm text-muted-foreground">
        文档加载中...
      </div>
    )
  }

  return (
    <MdxDocPage
      description={meta?.description}
      title={
        <span className="inline-flex items-baseline gap-2">
          <span>{meta?.title ?? slug}</span>
          {meta?.en ? <span className="text-sm text-muted-foreground">{meta.en}</span> : null}
        </span>
      }
      toc={toc}
      tocVariant="tocn"
    >
      <Page components={mdxComponents} />
    </MdxDocPage>
  )
}
