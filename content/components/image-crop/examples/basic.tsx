"use client"

import { useState, useEffect } from "react"
import {
  ImageCrop,
  ImageCropContent,
  ImageCropApply,
  ImageCropReset,
} from "@/components/ui/image-crop"

export default function ImageCropBasicExample() {
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext("2d")
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 800, 600)
      gradient.addColorStop(0, "#4F46E5")
      gradient.addColorStop(0.5, "#7C3AED")
      gradient.addColorStop(1, "#EC4899")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 800, 600)

      ctx.fillStyle = "rgba(255,255,255,0.9)"
      ctx.font = "bold 36px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Sample Image", 400, 270)
      ctx.font = "18px sans-serif"
      ctx.fillText("Drag to crop this region", 400, 310)

      canvas.toBlob((blob) => {
        if (blob) {
          setFile(new File([blob], "sample.png", { type: "image/png" }))
        }
      }, "image/png")
    }
  }, [])

  if (!file) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
        Loading preview...
      </div>
    )
  }

  return (
    <ImageCrop
      file={file}
      aspect={1}
      onCrop={(cropped) => console.log("Cropped image:", cropped)}
    >
      <ImageCropContent />
      <div className="mt-2 flex gap-2">
        <ImageCropApply />
        <ImageCropReset />
      </div>
    </ImageCrop>
  )
}
