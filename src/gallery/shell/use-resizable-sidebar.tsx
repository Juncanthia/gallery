import * as React from "react"

type UseResizableSidebarOptions = {
  storageKey: string
  defaultWidth: number
  min?: number
  max?: number
  direction?: "right" | "left"
}

type ResizableSidebarReturn = {
  width: number
  dragging: boolean
  startDrag: (event: React.MouseEvent) => void
  resetWidth: () => void
}

function readInitialWidth(storageKey: string, defaultWidth: number, min: number, max: number) {
  if (typeof window === "undefined") {
    return defaultWidth
  }

  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) {
      return defaultWidth
    }

    const next = Number.parseInt(stored, 10)
    return Number.isFinite(next) && next >= min && next <= max ? next : defaultWidth
  } catch {
    return defaultWidth
  }
}

export function useResizableSidebar({
  storageKey,
  defaultWidth,
  min = 160,
  max = 320,
  direction = "right",
}: UseResizableSidebarOptions): ResizableSidebarReturn {
  const [width, setWidth] = React.useState(() =>
    readInitialWidth(storageKey, defaultWidth, min, max)
  )
  const [dragging, setDragging] = React.useState(false)
  const persistTimer = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (persistTimer.current) {
      window.clearTimeout(persistTimer.current)
    }

    persistTimer.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, String(width))
      } catch {
        // ignore
      }
    }, 200)

    return () => {
      if (persistTimer.current) {
        window.clearTimeout(persistTimer.current)
      }
    }
  }, [storageKey, width])

  const startDrag = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setDragging(true)

      const startX = event.clientX
      const startWidth = width
      const sign = direction === "right" ? 1 : -1
      const previousCursor = document.body.style.cursor
      const previousUserSelect = document.body.style.userSelect

      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      function onMouseMove(moveEvent: MouseEvent) {
        const delta = (moveEvent.clientX - startX) * sign
        setWidth(Math.max(min, Math.min(max, startWidth + delta)))
      }

      function onMouseUp() {
        setDragging(false)
        document.body.style.cursor = previousCursor
        document.body.style.userSelect = previousUserSelect
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
      }

      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    },
    [direction, max, min, width]
  )

  const resetWidth = React.useCallback(() => {
    setWidth(defaultWidth)
  }, [defaultWidth])

  return { width, dragging, startDrag, resetWidth }
}
