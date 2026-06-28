"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ImageProps = {
  /** Image source URL. */
  src: string
  /** Alt text for the image. */
  alt?: string
  /** Image width. */
  width?: number | string
  /** Image height. */
  height?: number | string
  /** Whether clicking the image opens a preview. @default true */
  preview?: boolean
  /** Fallback element when image fails to load. */
  fallback?: React.ReactNode
  /** Placeholder element while image is loading. */
  placeholder?: React.ReactNode
  /** CSS class for the wrapper. */
  className?: string
  /** CSS class for the img element. */
  imgClassName?: string
  style?: React.CSSProperties
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "placeholder">

function Image({
  src,
  alt = "",
  width,
  height,
  preview = true,
  fallback,
  placeholder,
  className,
  imgClassName,
  style,
  ...imgProps
}: ImageProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(() => src ? "loading" : "error")
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  const handleLoad = () => setStatus("loaded")
  const handleError = () => setStatus("error")

  const image = (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "max-w-full object-cover transition-opacity duration-300",
        status === "loaded" ? "opacity-100" : "opacity-0",
        imgClassName,
      )}
      onLoad={handleLoad}
      onError={handleError}
      {...imgProps}
    />
  )

  const wrapper = (
    <div
      className={cn("relative inline-block overflow-hidden rounded", className)}
      style={{
        width: typeof width === "number" ? width : width,
        height: typeof height === "number" ? height : height,
        ...style,
      }}
      data-slot="image"
    >
      {placeholder && status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          {placeholder}
        </div>
      )}
      {status !== "error" && image}
      {status === "error" && !fallback && (
        <div className="flex items-center justify-center bg-muted text-sm text-muted-foreground" style={{ width, height }}>
          <span>Failed to load</span>
        </div>
      )}
      {status === "error" && fallback && fallback}
    </div>
  )

  if (!preview || status === "error") {
    return wrapper
  }

  return (
    <>
      <button
        type="button"
        className="cursor-zoom-in"
        onClick={() => setPreviewOpen(true)}
      >
        {wrapper}
      </button>
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewOpen(false)}
          role="dialog"
          aria-label="Image preview"
        >
          <button
            type="button"
            className="absolute top-4 right-4 rounded-sm bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setPreviewOpen(false)}
            aria-label="Close preview"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export { Image }
export type { ImageProps }
