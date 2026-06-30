"use client"

import { Video } from "@/components/ui/tool-video"

export default function Demo() {
  return (
    <Video
      id="demo-video"
      assetId="demo-video-asset"
      src="https://www.w3schools.com/html/mov_bbb.mp4"
      poster="https://www.w3schools.com/html/pic_trulli.jpg"
      title="Big Buck Bunny"
      description="A short animated film featuring a giant rabbit."
      domain="example.com"
      durationMs={596000}
      ratio="16:9"
      fit="cover"
      source={{
        label: "Sample Source",
        url: "https://example.com/video/bbb",
      }}
    />
  )
}
