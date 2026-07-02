"use client"

import React, {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"

import type { StreamPanelPlaylistPreset } from "@/components/media/stream-panel/content-catalog"
import type { StreamPanelPlayerType } from "@/components/media/stream-panel/use-stream-panel"
import type { StreamPreset } from "@/components/media/lib/stream-presets"
import type {
  PopoverHandle,
  PopoverOpenChangeDetails,
} from "@/components/core/popover"

export interface StreamPanelController {
  onLoadStream?: (src: string, config?: string) => void
  onPlaylistChange?: (playlist: StreamPanelPlaylistPreset) => void
  onPresetChange?: (preset: StreamPreset, kind?: "live" | "stream") => void
  playerType: StreamPanelPlayerType
}


interface StreamPanelContextValue {
  controller: null | StreamPanelController
  handle: PopoverHandle
  onOpenChange: (
    open: boolean,
    eventDetails: PopoverOpenChangeDetails
  ) => void
  open: boolean
  registerController: (controller: StreamPanelController) => () => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const StreamPanelContext = createContext<null | StreamPanelContextValue>(null)

export function StreamPanelProvider({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(open)
  const anchorElementRef = useRef<HTMLElement | null>(null)
  const [controller, setController] = useState<null | StreamPanelController>(
    null
  )

  openRef.current = open

  const handle = useMemo<PopoverHandle>(
    () => ({
      close: () => setOpen(false),
      getAnchorElement: () => anchorElementRef.current,
      isOpen: () => openRef.current,
      open: () => setOpen(true),
      setAnchorElement: (element) => {
        anchorElementRef.current = element
      },
      toggleOpen: () => {
        setOpen((current) => !current)
      },
    }),
    []
  )

  const onOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen)
  }, [])

  const registerController = useCallback((next: StreamPanelController) => {
    setController(next)
    return () => {
      setController((current) => (current === next ? null : current))
    }
  }, [])

  const value = useMemo(
    () => ({
      controller,
      handle,
      onOpenChange,
      open,
      registerController,
      setOpen,
    }),
    [controller, handle, onOpenChange, open, registerController]
  )

  return (
    <StreamPanelContext.Provider value={value}>
      {children}
    </StreamPanelContext.Provider>
  )
}

export function useStreamPanel() {
  const ctx = use(StreamPanelContext)
  if (!ctx)
    throw new Error("useStreamPanel must be used within StreamPanelProvider")
  return ctx
}
