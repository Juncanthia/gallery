import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ChevronRight,
  ComponentIcon,
  FileText,
  Home,
  Layers,
  LayoutTemplate,
  Menu,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { Link, Outlet, useRouterState } from "@tanstack/react-router"

import { Toaster } from "@/components/core/toaster"
import { cn } from "@/kit/utils"
import {
  galleryItemCount,
  GALLERY_NAV_GROUPS,
  type GalleryNavGroup,
  type GalleryNavItem,
} from "../registry/catalog"
import { LIBRARIES, getFilteredGroups } from "../registry/libraries"
import { PRIMARY_NAV } from "../registry/labels"
import { buildBreadcrumbSegments } from "../navigation/breadcrumb/build-breadcrumb"
import {
  GallerySearchDialog,
  type GallerySearchEntry,
} from "../navigation/search/search-dialog"
import { ResizeHandle } from "./resize-handle"
import { useResizableSidebar } from "./use-resizable-sidebar"

type GalleryCounts = {
  components: number
  blocks: number
  patterns: number
}

type GalleryShellProps = {
  title?: string
  navGroups?: GalleryNavGroup[]
  searchEntries?: GallerySearchEntry[]
  globalSearchEntries?: GallerySearchEntry[]
  counts?: GalleryCounts
  children?: ReactNode
}

function navItemTitle(item: GalleryNavItem) {
  return item.en ? `${item.label} · ${item.en}` : item.label
}

function navIconForItem(to: string) {
  if (to === "/components" || to === "/blocks" || to === "/patterns")
    return Home
  if (to.startsWith("/blocks")) return LayoutTemplate
  if (to.startsWith("/patterns")) return Layers
  if (to.startsWith("/components/evilcharts")) return BarChart3
  if (to.startsWith("/components/animateui")) return Sparkles
  return FileText
}

function componentSlugFromPath(to: string) {
  const match = /^\/components\/(.+)/.exec(to)
  return match?.[1]
}

function GalleryLink({
  to,
  className,
  children,
  title,
  onClick,
  ariaLabel,
}: {
  to: string
  className?: string
  children: ReactNode
  title?: string
  onClick?: () => void
  ariaLabel?: string
}) {
  const slug = componentSlugFromPath(to)

  if (slug) {
    return (
      <Link
        aria-label={ariaLabel}
        className={className}
        onClick={onClick}
        params={{ _splat: slug }}
        title={title}
        to="/components/$"
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
      title={title}
      to="/"
    >
      {children}
    </Link>
  )
}

export function GalleryShell({
  title = "组件实验室",
  navGroups = GALLERY_NAV_GROUPS,
  searchEntries = GALLERY_NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      group: group.group,
      groupEn: group.groupEn,
    }))
  ),
  globalSearchEntries = [],
  counts = { components: galleryItemCount, blocks: 0, patterns: 0 },
  children,
}: GalleryShellProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLibrary, setActiveLibrary] = useState<string>(LIBRARIES[0]?.id ?? "kibo-ui")
  const [sidebarTab, setSidebarTab] = useState<"components" | "blocks">("components")
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  )
  const currentLibrary = LIBRARIES.find((lib) => lib.id === activeLibrary) ?? LIBRARIES[0]
  const contentScrollRef = useRef<HTMLDivElement>(null)
  const resizable = useResizableSidebar({
    storageKey: "gallery-nav-width",
    defaultWidth: 220,
    min: 180,
    max: 260,
  })

  const primaryNavItems = [
    {
      count: counts.components,
      description: "可复用的 UI 单元，覆盖基础、表单、数据展示与业务增强。",
      href: "/components/button",
      label: PRIMARY_NAV.components.zh,
      en: PRIMARY_NAV.components.en,
    },
  ] as const

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark")
    setDarkMode((value) => !value)
  }

  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "auto" })
  }, [pathname])

  const isActive = (to: string) => pathname === to
  const isPrimaryActive = (to: string) =>
    to.startsWith("/components")
      ? pathname.startsWith("/components")
      : pathname === to || pathname.startsWith(`${to}/`)
  const currentPrimaryItem = primaryNavItems.find((item) =>
    isPrimaryActive(item.href)
  )
  const breadcrumbSegments = useMemo(
    () => buildBreadcrumbSegments(pathname),
    [pathname]
  )

  const { componentGroups, blockGroups } = useMemo(() => {
    const libraryGroups = getFilteredGroups(navGroups, activeLibrary)
    const components: GalleryNavGroup[] = []
    const blocks: GalleryNavGroup[] = []
    for (const group of libraryGroups) {
      if (group.group === "复合组件" || group.groupEn === "Blocks") {
        blocks.push(group)
      } else {
        components.push(group)
      }
    }
    return { componentGroups: components, blockGroups: blocks }
  }, [navGroups, activeLibrary])

  const visibleGroups = sidebarTab === "components" ? componentGroups : blockGroups

  const flatItems = useMemo(
    () => visibleGroups.flatMap((group) => group.items),
    [visibleGroups]
  )
  const currentIndex = flatItems.findIndex((item) => item.to === pathname)
  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : null
  const nextItem =
    currentIndex >= 0 && currentIndex < flatItems.length - 1
      ? flatItems[currentIndex + 1]
      : null
  const showPager =
    currentIndex >= 0 && (prevItem !== null || nextItem !== null)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center justify-between gap-4 border-b border-border/50 bg-background/95 px-4 backdrop-blur-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            className="flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground xl:hidden"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <Menu className="size-5" />
          </button>
          <nav
            aria-label="breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
          >
            <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">
              Gallery
            </span>
            <ChevronRight className="hidden size-3.5 shrink-0 text-muted-foreground/70 sm:block" />
            <Link
              className="hidden shrink-0 text-sm font-medium text-foreground hover:underline sm:block"
              to="/"
            >
              {title}
            </Link>
            {breadcrumbSegments.length > 0 ? (
              breadcrumbSegments.map((segment, index) => {
                const isLastSegment = index === breadcrumbSegments.length - 1

                return (
                  <span
                    className={cn(
                      "min-w-0 items-center gap-1.5",
                      isLastSegment ? "flex" : "hidden sm:flex"
                    )}
                    key={segment.label}
                  >
                    <ChevronRight
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground/70",
                        isLastSegment && "hidden sm:block"
                      )}
                    />
                    {segment.href ? (
                      <GalleryLink
                        className="truncate font-medium text-foreground hover:underline"
                        to={segment.href}
                      >
                        {segment.label}
                      </GalleryLink>
                    ) : (
                      <span className="truncate font-medium text-foreground">
                        {segment.label}
                      </span>
                    )}
                  </span>
                )
              })
            ) : (
              <>
                <ChevronRight className="hidden size-3.5 shrink-0 text-muted-foreground/70 sm:block" />
                <span className="truncate font-medium text-foreground">
                  {currentPrimaryItem
                    ? `${currentPrimaryItem.label} ${currentPrimaryItem.en}`
                    : title}
                </span>
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="flex max-w-lg flex-nowrap items-center gap-px overflow-x-auto scrollbar-none rounded-lg bg-muted p-0.5">
            {LIBRARIES.map((lib) => (
              <button
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap",
                  activeLibrary === lib.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                key={lib.id}
                onClick={() => {
                  setActiveLibrary(lib.id)
                  if (!lib.hasBlocks) setSidebarTab("components")
                }}
                type="button"
              >
                {lib.label}
              </button>
            ))}
          </div>
          <button
            aria-label="Toggle dark mode"
            className="flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={toggleDark}
            type="button"
          >
            {darkMode ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        {sidebarOpen ? (
          <button
            aria-label="关闭侧栏"
            className="fixed inset-x-0 top-12 bottom-0 z-20 bg-black/40 xl:hidden"
            onClick={() => setSidebarOpen(false)}
            type="button"
          />
        ) : null}

        <aside
          aria-label={title}
          className={cn(
            "fixed top-12 bottom-0 left-0 z-30 flex w-[min(84vw,18rem)] shrink-0 scrollbar-none flex-col gap-px overflow-y-auto border-r border-border bg-background p-3 shadow transition-transform duration-200 xl:w-[var(--gallery-nav-width)]",
            "xl:sticky xl:top-12 xl:z-10 xl:h-full xl:translate-x-0 xl:shadow-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          style={
            { "--gallery-nav-width": `${resizable.width}px` } as CSSProperties
          }
        >
          <div className="mb-3 rounded border border-border bg-muted/40 px-3 py-3">
            <ComponentIcon
              className="size-4 text-foreground"
              strokeWidth={1.6}
            />
            <div className="mt-2 text-sm font-semibold text-foreground">
              {title}
            </div>
            <div className="mt-1 text-[11px] leading-4 text-muted-foreground">
              shadcn、Radix、Tailwind 统一浏览
            </div>
          </div>

          <div className="mb-2">
            <GallerySearchDialog
              globalSearchEntries={globalSearchEntries}
              searchEntries={searchEntries}
            />
          </div>

          {blockGroups.length > 0 && currentLibrary.hasBlocks ? (
            <div className="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              <button
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  sidebarTab === "components"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setSidebarTab("components")}
                type="button"
              >
                组件
              </button>
              <button
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  sidebarTab === "blocks"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setSidebarTab("blocks")}
                type="button"
              >
                复合组件
              </button>
            </div>
          ) : null}

          <nav className="flex scrollbar-thin flex-col gap-px">
            {visibleGroups.map((group, groupIndex) => (
              <div key={group.group}>
                {groupIndex > 0 ? (
                  <div className="my-1.5 h-px bg-border" />
                ) : null}
                <div className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground/70 uppercase">
                  {[group.group, group.groupEn].filter(Boolean).join(" ")}
                </div>
                <div className="flex flex-col gap-px">
                  {group.items.map((item) => {
                    const Icon = navIconForItem(item.to)
                    const hasApi = item.api === true

                    return (
                      <GalleryLink
                        ariaLabel={navItemTitle(item)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors",
                          isActive(item.to)
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        key={item.to}
                        onClick={() => setSidebarOpen(false)}
                        title={navItemTitle(item)}
                        to={item.to}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="min-w-0 truncate">{item.label}</span>
                        {item.en ? (
                          <span className="min-w-0 truncate text-xs text-muted-foreground">
                            {item.en}
                          </span>
                        ) : null}
                        {hasApi ? (
                          <span className={cn(
                            "ml-auto shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium leading-tight",
                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            API
                          </span>
                        ) : null}
                        {item.antd && item.migration ? (
                          <span className={cn(
                            "shrink-0 rounded-full px-1.5 py-px text-[10px] font-medium leading-tight",
                            hasApi ? "" : "ml-auto",
                            isActive(item.to)
                              ? "bg-primary/15 text-primary"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          )}>
                            {item.migration}%
                          </span>
                        ) : null}
                      </GalleryLink>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <ResizeHandle
            className="hidden xl:block"
            dragging={resizable.dragging}
            onDoubleClick={resizable.resetWidth}
            onMouseDown={resizable.startDrag}
          />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
          <main className="relative min-h-0 flex-1 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0 overflow-hidden bg-background"
            >
              <div className="h-full w-full [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.12)_1px,transparent_0)] [background-size:18px_18px] opacity-80 dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)]" />
            </div>
            <div
              className="scrollbar-mini relative z-10 h-full overflow-y-auto p-4 sm:p-5 xl:p-6 2xl:p-8"
              data-gallery-scroll-root
              ref={contentScrollRef}
            >
              <div className="mx-auto flex min-h-full w-full max-w-[1240px] flex-col gap-6">
                {children ?? <Outlet />}

                {showPager ? (
                  <div className="grid gap-3 pt-2 md:grid-cols-2">
                    {prevItem ? (
                      <GalleryLink
                        className="group rounded-2xl border border-border/60 bg-background/80 px-4 py-4 transition-colors hover:bg-accent/40"
                        to={prevItem.to}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-lg border border-border/60 bg-muted/30 p-2 text-muted-foreground">
                            <ArrowLeft className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="mt-1 truncate text-sm font-semibold">
                              {prevItem.label}
                            </div>
                            {prevItem.en ? (
                              <div className="truncate text-xs text-muted-foreground">
                                {prevItem.en}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </GalleryLink>
                    ) : (
                      <div className="hidden md:block" />
                    )}

                    {nextItem ? (
                      <GalleryLink
                        className="group rounded-2xl border border-border/60 bg-background/80 px-4 py-4 text-right transition-colors hover:bg-accent/40"
                        to={nextItem.to}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="mt-1 truncate text-sm font-semibold">
                              {nextItem.label}
                            </div>
                            {nextItem.en ? (
                              <div className="truncate text-xs text-muted-foreground">
                                {nextItem.en}
                              </div>
                            ) : null}
                          </div>
                          <div className="mt-0.5 rounded-lg border border-border/60 bg-muted/30 p-2 text-muted-foreground">
                            <ArrowRight className="size-4" />
                          </div>
                        </div>
                      </GalleryLink>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  )
}
