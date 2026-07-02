const RECENT_VISITS_KEY = "gallery:recent-visits"
const RECENT_VISITS_LIMIT = 8

export function readRecentVisits(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_VISITS_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is string => typeof item === "string")
  } catch {
    return []
  }
}

export function rememberRecentVisit(path: string): string[] {
  const next = [path, ...readRecentVisits().filter((item) => item !== path)].slice(
    0,
    RECENT_VISITS_LIMIT
  )

  try {
    window.localStorage.setItem(RECENT_VISITS_KEY, JSON.stringify(next))
  } catch {
    // localStorage can be unavailable in private contexts; search should still work.
  }

  return next
}
