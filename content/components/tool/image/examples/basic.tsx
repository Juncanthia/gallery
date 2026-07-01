"use client"

import { Image } from "@/components/agent-tools/image/image"

export default function Demo() {
  return (
    <Image
      id="demo-image"
      assetId="demo-image-asset"
      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
      alt="Mountain landscape with a lake and pine trees under a clear blue sky"
      title="Mountain Landscape"
      domain="unsplash.com"
      ratio="16:9"
      fit="cover"
      source={{
        label: "Unsplash",
        url: "https://unsplash.com/photos/mountain-landscape",
      }}
    />
  )
}
