import { isValidElement, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { DocTableOfContents } from "../navigation/toc/table-of-contents"

type TocItem = {
  depth: number
  title: ReactNode
  url: string
}

type MdxDocPageProps = {
  title?: ReactNode
  description?: string
  toc?: TocItem[]
  tocVariant?: "simple" | "tocn"
  children: ReactNode
  className?: string
}

function tocTitle(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(tocTitle).join("")
  }

  if (isValidElement<{ children?: ReactNode }>(value)) {
    return tocTitle(value.props.children)
  }

  return ""
}

function tocId(url: string) {
  const hashIndex = url.indexOf("#")
  const rawId = hashIndex >= 0 ? url.slice(hashIndex + 1) : url

  try {
    return decodeURIComponent(rawId)
  } catch {
    return rawId
  }
}

export function MdxDocPage({
  title,
  description,
  toc = [],
  tocVariant = "simple",
  children,
  className,
}: MdxDocPageProps) {
  const visibleToc = toc.filter((item) => item.depth > 1 && item.depth <= 3)
  const docToc = visibleToc
    .map((item) => ({
      id: tocId(item.url),
      title: tocTitle(item.title),
      depth: item.depth,
    }))
    .filter((item) => item.id.length > 0 && item.title.length > 0)

  return (
    <div className={cn("space-y-6", className)}>
      <div
        className={cn(
          "grid gap-8",
          tocVariant === "tocn"
            ? "xl:grid-cols-[minmax(0,900px)_220px] xl:justify-center"
            : "xl:grid-cols-[minmax(0,1fr)_12rem]"
        )}
      >
        <article className="min-w-0">
          <header className="mb-8 border-b pb-6">
            <h1 className="canthia-doc-title font-semibold">{title}</h1>
            {description ? (
              <p className="mt-2 text-muted-foreground">{description}</p>
            ) : null}
            {tocVariant === "tocn" && docToc.length > 0 ? (
              <DocTableOfContents
                className="mt-4 xl:hidden"
                items={docToc}
                mobile
              />
            ) : null}
          </header>
          <div className="canthia-mdx max-w-none">{children}</div>
        </article>

        {visibleToc.length > 0 ? (
          <aside className="hidden xl:block">
            <div className="scrollbar-mini sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1 text-sm">
              {tocVariant === "tocn" ? (
                <DocTableOfContents items={docToc} />
              ) : (
                <>
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    页面目录
                  </p>
                  <nav className="flex flex-col gap-1">
                    {visibleToc.map((item) => (
                      <a
                        className={cn(
                          "text-muted-foreground transition-colors hover:text-foreground",
                          item.depth === 3 && "pl-3 text-xs"
                        )}
                        href={item.url}
                        key={`${item.url}-${tocTitle(item.title)}`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </>
              )}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
