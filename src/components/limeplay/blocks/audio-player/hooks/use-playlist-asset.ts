"use client"

import type {
  AudioPlayerAsset,
  PlaybackUrls,
} from "@hyper/limeplay/blocks/audio-player/components/audio-source"
import type { UseAssetReturn } from "@hyper/limeplay/hooks/use-asset"

import { useAsset } from "@hyper/limeplay/hooks/use-asset"

export type { PlaybackUrls }

export type PlaylistAsset = AudioPlayerAsset

export interface UsePlaylistAssetReturn extends UseAssetReturn<PlaylistAsset> {
  items: PlaylistAsset[]
}

export function usePlaylistAsset(): UsePlaylistAssetReturn {
  const asset = useAsset<PlaylistAsset>()
  const items = asset.orderedItems.map((item) => item.properties)

  return {
    ...asset,
    items,
  }
}
