export type Theme = "dark" | "light" | "system"
export type ResolvedTheme = "dark" | "light"

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Theme[] = ["dark", "light", "system"]

export function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

export function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

export function applyTheme(
  nextTheme: Theme,
  disableTransitionOnChange = true
) {
  const root = document.documentElement
  const resolvedTheme =
    nextTheme === "system" ? getSystemTheme() : nextTheme
  const restoreTransitions = disableTransitionOnChange
    ? disableTransitionsTemporarily()
    : null

  root.classList.remove("light", "dark")
  root.classList.add(resolvedTheme)

  if (restoreTransitions) {
    restoreTransitions()
  }
}

export { COLOR_SCHEME_QUERY }
