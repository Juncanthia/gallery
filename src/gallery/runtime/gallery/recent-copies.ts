export const RECENT_COPIES_KEY = "gallery:recent-copies"
export const RECENT_COPIES_LIMIT = 5

export type RecentCopyItem = {
  id: string
  title: string
  href: string
  importPath?: string
  copiedAt: number
}

export function readRecentCopies(): RecentCopyItem[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const raw = window.localStorage.getItem(RECENT_COPIES_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []

    return Array.isArray(parsed) ? (parsed as RecentCopyItem[]) : []
  } catch {
    return []
  }
}

export function rememberRecentCopy(item: Omit<RecentCopyItem, "copiedAt">): void {
  if (typeof window === "undefined") {
    return
  }

  const next: RecentCopyItem[] = [
    { ...item, copiedAt: Date.now() },
    ...readRecentCopies().filter((current) => current.id !== item.id),
  ].slice(0, RECENT_COPIES_LIMIT)

  try {
    window.localStorage.setItem(RECENT_COPIES_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}
