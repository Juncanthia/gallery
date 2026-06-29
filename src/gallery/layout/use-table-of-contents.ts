import * as React from "react"

export type TableOfContentsItem = {
  id: string
  title: string
  depth?: number
}

export type UseScrollSpyOptions = {
  root?: Element | null
  rootMargin?: string
}

function parseTopOffset(rootMargin: string): number {
  const top = rootMargin.trim().split(/\s+/)[0] ?? "0px"
  const value = Number.parseFloat(top)

  if (Number.isNaN(value)) {
    return 0
  }

  return Math.abs(value)
}

function getActiveIdFromScrollPosition(
  ids: string[],
  root: Element | null,
  offset: number
): string | undefined {
  if (ids.length === 0) {
    return undefined
  }

  const rootTop = root?.getBoundingClientRect().top ?? 0
  let activeId: string | undefined = ids[0]

  for (const id of ids) {
    const element = document.getElementById(id)
    if (!element) {
      continue
    }

    const top = element.getBoundingClientRect().top - rootTop

    if (top <= offset) {
      activeId = id
    }
  }

  return activeId
}

function isScrollable(element: HTMLElement): boolean {
  const overflowY = window.getComputedStyle(element).overflowY

  return (
    (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
    element.scrollHeight > element.clientHeight
  )
}

function getScrollRoot(ids: string[]): Element | null {
  for (const id of ids) {
    let element = document.getElementById(id)?.parentElement

    while (element && element !== document.body) {
      if (isScrollable(element)) {
        return element
      }

      element = element.parentElement
    }
  }

  return null
}

export function useScrollSpy(
  ids: string[],
  options: UseScrollSpyOptions = {}
): string | undefined {
  const { root = null, rootMargin = "0px 0px -80% 0px" } = options
  const [activeId, setActiveId] = React.useState<string | undefined>(ids[0])
  const offset = parseTopOffset(rootMargin)

  React.useEffect(() => {
    if (ids.length === 0) {
      return
    }

    let frame = 0
    const scrollRoot = root ?? getScrollRoot(ids)

    const update = () => {
      const nextActiveId = getActiveIdFromScrollPosition(ids, scrollRoot, offset)

      if (nextActiveId) {
        setActiveId(nextActiveId)
      }
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()

    const scrollTarget = scrollRoot ?? window
    scrollTarget.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      scrollTarget.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [ids, root, offset])

  return activeId
}
