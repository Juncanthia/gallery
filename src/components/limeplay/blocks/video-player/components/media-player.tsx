"use client"

import { RotateCwIcon } from "lucide-react"
import React from "react"

import type {
  Asset,
  PlayerSource,
  UseAssetOptions,
} from "@hyper/limeplay/hooks/use-asset"

import { cn } from "@hyper/limeplay/lib/utils"
import { AssetMetadataOverlay } from "@hyper/limeplay/blocks/video-player/components/asset-metadata-overlay"
import { BottomControls } from "@hyper/limeplay/blocks/video-player/components/bottom-controls"
import { Button } from "@hyper/limeplay/blocks/video-player/components/button"
import { MediaProvider } from "@hyper/limeplay/blocks/video-player/lib/media-kit"
import { useAsset } from "@hyper/limeplay/hooks/use-asset"
import { usePlaybackStore } from "@hyper/limeplay/hooks/use-playback"
import { PlaybackSourceController } from "@hyper/limeplay/hooks/use-playback-source"
import { CaptionsContainer } from "@hyper/limeplay/ui/captions"
import { ErrorScreen } from "@hyper/limeplay/ui/error-screen"
import { FallbackPoster } from "@hyper/limeplay/ui/fallback-poster"
import { LimeplayLogo } from "@hyper/limeplay/ui/limeplay-logo"
import { Media } from "@hyper/limeplay/ui/media"
import * as Layout from "@hyper/limeplay/ui/player-layout"
import { RootContainer } from "@hyper/limeplay/ui/root-container"

export interface VideoPlayerAsset extends Asset {
  description?: string
  poster?: string
  title?: string
  year?: string
}

export interface VideoPlayerProps {
  autoLoad?: boolean
  children?: React.ReactNode
  className?: string
  controlsHideDelay?: number
  debug?: boolean
  hideCursorOnIdle?: boolean
  initialIndex?: number
  loading?: UseAssetOptions<VideoPlayerAsset>
  /**
   * Props to pass to the underlying video element.
   */
  mediaProps?: Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "as" | "src">
  source?: PlayerSource<VideoPlayerAsset>
  sourceKey?: string
}

export const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      autoLoad,
      children,
      className,
      controlsHideDelay,
      debug,
      hideCursorOnIdle,
      initialIndex,
      loading,
      mediaProps,
      source,
      sourceKey,
    },
    ref
  ) => {
    const { className: mediaClassName, ...safeMediaProps } = mediaProps ?? {}

    return (
      <MediaProvider debug={debug}>
        <PlaybackSourceController
          autoLoad={autoLoad}
          initialIndex={initialIndex}
          loading={loading}
          source={source}
          sourceKey={sourceKey}
        />
        <RootContainer
          className={cn("m-auto w-full", className)}
          controlsHideDelay={controlsHideDelay}
          hideCursorOnIdle={hideCursorOnIdle}
          ref={ref}
        >
          <Layout.PlayerContainer>
            <PlayerErrorScreen />
            <FallbackPoster>
              <LimeplayLogo />
            </FallbackPoster>
            <Media
              {...(safeMediaProps as React.ComponentPropsWithoutRef<
                typeof Media
              >)}
              as="video"
              className={cn("size-full object-cover", mediaClassName)}
            />
            {children}
            <Layout.ControlsOverlayContainer />
            <Layout.ControlsContainer className="pb-6">
              <AssetMetadataOverlay />
              <CaptionsContainer />
              <BottomControls />
            </Layout.ControlsContainer>
          </Layout.PlayerContainer>
        </RootContainer>
      </MediaProvider>
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"

function PlayerErrorScreen() {
  const error = usePlaybackStore((s) => s.error)
  const status = usePlaybackStore((s) => s.status)
  const { currentItem, loadAsset } = useAsset<VideoPlayerAsset>()

  const retryStream = React.useCallback(() => {
    if (!currentItem) return
    void loadAsset(currentItem.properties)
  }, [currentItem, loadAsset])

  if (status !== "error") return null

  return (
    <ErrorScreen className="rounded-lg" error={error}>
      <Button onClick={retryStream} size="sm">
        <RotateCwIcon />
        Retry
      </Button>
    </ErrorScreen>
  )
}
