import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { CornerDownLeft, Search } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/core/dialog"
import { Input } from "@/components/core/input"
import { cn } from "@/kit/utils"
import { gallerySearchEntries } from "../../registry/catalog"
import { readRecentVisits, rememberRecentVisit } from "../../runtime/recent-visits"

const QUICK_QUERIES = ["按钮", "loading", "icon", "形态"]

export type GallerySearchEntry = (typeof gallerySearchEntries)[number] & {
  name?: string
}

type GallerySearchDialogProps = {
  collapsed?: boolean
  searchEntries?: GallerySearchEntry[]
  globalSearchEntries?: GallerySearchEntry[]
}

type SearchEntry = GallerySearchEntry
type SearchResult = SearchEntry & {
  matchType: "最近" | "推荐" | "入口" | "组件"
  labelHtml: string
  metaHtml: string
  snippetHtml: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function highlight(value: string, query: string) {
  const token = query.trim().toLowerCase()

  if (!token) {
    return escapeHtml(value)
  }

  const lower = value.toLowerCase()
  let cursor = 0
  let html = ""
  let from = 0

  while (from < lower.length) {
    const index = lower.indexOf(token, from)

    if (index === -1) {
      break
    }

    html += escapeHtml(value.slice(cursor, index))
    html += `<mark class="gallery-search-match">${escapeHtml(
      value.slice(index, index + token.length)
    )}</mark>`

    cursor = index + token.length
    from = cursor
  }

  html += escapeHtml(value.slice(cursor))
  return html
}

export function GallerySearchDialog({
  collapsed = false,
  searchEntries = gallerySearchEntries,
  globalSearchEntries = [],
}: GallerySearchDialogProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentPaths, setRecentPaths] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readRecentVisits()
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const entryByPath = useMemo(() => {
    const entries = new Map<string, SearchEntry>()

    for (const entry of [...globalSearchEntries, ...searchEntries]) {
      entries.set(entry.to, entry)
    }

    return entries
  }, [globalSearchEntries, searchEntries])

  const searchableEntries = useMemo(
    () => [...globalSearchEntries, ...searchEntries],
    [globalSearchEntries, searchEntries]
  )

  const results = useMemo(() => {
    const token = query.trim().toLowerCase()

    if (!token) {
      const recent = recentPaths
        .map((path) => entryByPath.get(path))
        .filter((entry): entry is SearchEntry => entry !== undefined)
      const seen = new Set<string>()

      return [...recent, ...searchableEntries].flatMap<SearchResult>((entry) => {
        if (seen.has(entry.to)) {
          return []
        }

        seen.add(entry.to)
        return [
          {
            ...entry,
            matchType: recentPaths.includes(entry.to) ? "最近" : "入口",
            labelHtml: escapeHtml(entry.label),
            metaHtml: escapeHtml(`${entry.en} · ${entry.group}`),
            snippetHtml: escapeHtml(entry.summary),
          },
        ]
      }).slice(0, 14)
    }

    return searchableEntries
      .filter((entry) =>
        [
          entry.label,
          entry.en,
          entry.summary,
          entry.group,
          entry.groupEn,
          ...entry.keywords,
        ]
          .join(" ")
          .toLowerCase()
          .includes(token)
      )
      .map<SearchResult>((entry) => ({
        ...entry,
        matchType: "组件",
        labelHtml: highlight(entry.label, query),
        metaHtml: escapeHtml(`${entry.en} · ${entry.group}`),
        snippetHtml: highlight(entry.summary, query),
      }))
      .slice(0, 12)
  }, [entryByPath, query, recentPaths, searchableEntries])

  const normalizedActiveIndex =
    results.length > 0 ? Math.min(activeIndex, results.length - 1) : 0

  const closePanel = useCallback(() => {
    setOpen(false)
    setQuery("")
    setActiveIndex(0)
  }, [])

  const openPanel = useCallback(() => {
    setRecentPaths(readRecentVisits())
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        openPanel()
        return
      }

      closePanel()
    },
    [closePanel, openPanel]
  )

  const go = useCallback((to: string) => {
    const slug = to.split("/").filter(Boolean).at(-1) ?? "button"

    setRecentPaths(rememberRecentVisit(to))
    closePanel()
    navigate({
      params: { _splat: slug },
      to: "/components/$",
    })
  }, [closePanel, navigate])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        openPanel()
      }

      if (event.key === "Escape" && open) {
        closePanel()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [closePanel, open, openPanel])

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const moveActive = (step: number) => {
    if (!results.length) {
      return
    }

    setActiveIndex((index) => (index + step + results.length) % results.length)
  }

  return (
    <>
      <button
        className={cn(
          "group w-full rounded border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          collapsed
            ? "flex h-8 items-center justify-center"
            : "flex h-8 w-full items-center gap-2 px-2 text-left"
        )}
        onClick={openPanel}
        type="button"
      >
        <Search className="size-3.5 shrink-0" />
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 truncate text-xs font-medium">
              搜索页面 / 用途 / 代码
            </span>
            <span className="hidden shrink-0 items-center gap-1 rounded border border-border bg-muted px-1 py-0.5 sm:flex">
              <span className="font-medium text-[10px] leading-none">Ctrl</span>
              <span className="font-medium text-[10px] leading-none">K</span>
            </span>
          </>
        ) : null}
      </button>

      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent className="top-[5%] flex max-h-[85vh] flex-col overflow-hidden p-6 translate-y-0 sm:top-[10%] sm:max-w-2xl sm:translate-y-0">
          <DialogHeader className="shrink-0">
            <DialogTitle>命令面板</DialogTitle>
            <DialogDescription>可搜索组件名、用途说明、分组，以及文档内容。</DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden">
            <div className="relative shrink-0">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoComplete="off"
                className="h-11 pl-9 text-sm"
                id="gallery-search-input"
                name="gallery-search"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault()
                    moveActive(1)
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault()
                    moveActive(-1)
                  } else if (event.key === "Enter") {
                    event.preventDefault()
                    const target = results[normalizedActiveIndex]?.to ?? results[0]?.to
                    if (target) {
                      go(target)
                    }
                  }
                }}
                placeholder="搜索组件名、用途、文档..."
                ref={inputRef}
                value={query}
              />
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 px-1">
              <span className="text-[11px] text-muted-foreground">试试搜索</span>
              {QUICK_QUERIES.map((item) => (
                <button
                  className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  key={item}
                  onClick={() => {
                    setQuery(item)
                    setActiveIndex(0)
                    inputRef.current?.focus()
                  }}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-background/70 shadow-sm">
              {!query.trim() && (
                <div className="flex shrink-0 items-center justify-between border-border/60 border-b bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
                  <span>最近访问与推荐入口</span>
                  <span className="hidden sm:inline">输入用途、组件名或文档关键词继续筛选</span>
                </div>
              )}

              {results.length > 0 ? (
                <div aria-label="搜索结果" className="flex-1 overflow-y-auto p-2" role="listbox">
                  {results.map((entry, index) => (
                    <button
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-left transition-all",
                        index === normalizedActiveIndex
                          ? "border-primary/30 bg-accent text-accent-foreground shadow-sm"
                          : "border-transparent hover:border-border/60 hover:bg-accent/50"
                      )}
                      key={`${entry.to}-${index}`}
                      onClick={() => go(entry.to)}
                      onMouseEnter={() => setActiveIndex(index)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="truncate font-semibold text-sm"
                              dangerouslySetInnerHTML={{ __html: entry.labelHtml }}
                            />
                            <span className="shrink-0 rounded-md border border-border/60 bg-muted/70 px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground leading-none">
                              {entry.matchType}
                            </span>
                          </div>
                          <div
                            className="mt-1 truncate text-muted-foreground text-xs"
                            dangerouslySetInnerHTML={{ __html: entry.metaHtml }}
                          />
                          {entry.snippetHtml ? (
                            <div
                              className="mt-1.5 truncate text-[11px] text-muted-foreground/90 leading-5"
                              dangerouslySetInnerHTML={{ __html: entry.snippetHtml }}
                            />
                          ) : null}
                        </div>
                        <CornerDownLeft className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-40 flex-1 items-center justify-center px-4 py-8 text-muted-foreground text-sm">
                  {query.trim() ? "没有找到匹配的组件或文档" : "暂无最近访问"}
                </div>
              )}

              <div className="flex shrink-0 items-center justify-between border-border/60 border-t bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <span className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 font-medium text-foreground/80">
                      ↑↓
                    </span>
                    切换
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 font-medium text-foreground/80">
                      Enter
                    </span>
                    打开
                  </span>
                  <span className="hidden items-center gap-1 sm:inline-flex">
                    <span className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 font-medium text-foreground/80">
                      Esc
                    </span>
                    关闭
                  </span>
                </div>
                <span>{query.trim() ? `${results.length} 个结果` : "最近访问与推荐入口"}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
