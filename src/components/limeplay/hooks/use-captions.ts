"use client"

import type shaka from "shaka-player"

// shaka-player's compiled Player type defs omit text-track APIs that this hook
// relies on; declare the subset we use and cast at the call sites.
type ShakaPlayerWithText = shaka.Player & {
  selectTextTrack(track: shaka.extern.TextTrack): void
  getTextTracks(): shaka.extern.TextTrack[]
  setTextTrackVisibility(visible: boolean): Promise<void> | void
  isTextTrackVisible(): boolean
}

import { useEffect } from "react"

import type {
  MediaFeature,
  MediaStore,
} from "@hyper/limeplay/ui/media-provider"

import { useMediaStore } from "@hyper/limeplay/hooks/use-media"
import { usePlaybackStore } from "@hyper/limeplay/hooks/use-playback"
import {
  type PlayerStore,
  usePlayerStore,
} from "@hyper/limeplay/hooks/use-player"
import { getDeviceLanguage, off, on } from "@hyper/limeplay/lib/utils"
import {
  useMediaFeatureApi,
  useMediaFeatureStore,
} from "@hyper/limeplay/ui/media-provider"

export const CAPTIONS_FEATURE_KEY = "captions"

export interface CaptionsStore {
  [CAPTIONS_FEATURE_KEY]: {
    activeTrack: null | shaka.extern.TextTrack
    containerElement: HTMLDivElement | null
    setContainerElement: (ref: HTMLDivElement | null) => void
    toggleVisibility: () => void
    tracks?: shaka.extern.TextTrack[]
    visible: boolean
  }
}

export function captionsFeature(): MediaFeature<
  CaptionsStore,
  CaptionsStore & MediaStore & PlayerStore
> {
  return {
    createSlice: (set, get) => ({
      [CAPTIONS_FEATURE_KEY]: {
        activeTrack: null,
        containerElement: null,
        setContainerElement: (element) => {
          set(({ captions }) => {
            captions.containerElement = element
          })
        },
        toggleVisibility: () => {
          const player = get().player.instance as ShakaPlayerWithText | null
          if (!player) {
            return
          }

          const captions = get().captions

          if (!captions.activeTrack) {
            const defaultTrack = findDefaultTrack(captions.tracks)
            if (defaultTrack) {
              player.selectTextTrack(defaultTrack)

              const activeTrack = player
                .getTextTracks()
                .find((track: shaka.extern.TextTrack) => track.active)

              set(({ captions }) => {
                captions.activeTrack = activeTrack ?? null
              })
            }
          }

          player.setTextTrackVisibility(!captions.visible)
        },
        tracks: undefined,
        visible: false,
      },
    }),
    key: CAPTIONS_FEATURE_KEY,
    Setup: CaptionsSetup,
  }
}

export function useCaptions() {
  return useCaptionsStore((state) => state)
}

export function useCaptionsStore<TSelected>(
  selector: (state: CaptionsStore["captions"]) => TSelected
): TSelected {
  return useMediaFeatureStore<CaptionsStore, TSelected>(
    CAPTIONS_FEATURE_KEY,
    (state) => selector(state.captions)
  )
}

function CaptionsSetup() {
  const store = useMediaFeatureApi<CaptionsStore>(CAPTIONS_FEATURE_KEY)
  const player = usePlayerStore((state) => state.instance) as ShakaPlayerWithText | null
  const containerElement = useCaptionsStore((state) => state.containerElement)
  const mediaElement = useMediaStore((state) => state.mediaElement)
  const canPlay = usePlaybackStore((state) => state.canPlay)

  const onTextTrackChanged = () => {
    if (!player) {
      return
    }

    const activeTrack = player
      .getTextTracks()
      .find((track: shaka.extern.TextTrack) => track.active)

    store.setState(({ captions }) => {
      captions.activeTrack = activeTrack ?? null
    })
  }

  const onTracksChanged = () => {
    if (!player) {
      return
    }

    store.setState(({ captions }) => {
      captions.tracks = player.getTextTracks()
    })
  }

  const onTextTrackVisibility = () => {
    if (!player) {
      return
    }

    store.setState(({ captions }) => {
      captions.visible = player.isTextTrackVisible()
    })
  }

  useEffect(() => {
    if (!player || !containerElement) {
      return
    }

    player.setVideoContainer(containerElement)
  }, [containerElement, player])

  useEffect(() => {
    if (!mediaElement || !player) return

    if (canPlay) {
      onTracksChanged()
    }

    on(player, "textchanged", onTextTrackChanged)
    on(player, ["trackschanged", "loading"], onTracksChanged)
    on(player, "texttrackvisibility", onTextTrackVisibility)

    return () => {
      off(player, "textchanged", onTextTrackChanged)
      off(player, ["trackschanged", "loading"], onTracksChanged)
      off(player, "texttrackvisibility", onTextTrackVisibility)
    }
  }, [canPlay, mediaElement, player])

  return null
}

function findDefaultTrack(tracks?: shaka.extern.TextTrack[]) {
  if (!tracks || tracks.length === 0) {
    console.warn("No text tracks found")
    return
  }

  if (tracks.length === 1) {
    return tracks[0]
  }

  const deviceLanguage = getDeviceLanguage()

  return tracks.find((track) => track.language === deviceLanguage) ?? tracks[0]
}
