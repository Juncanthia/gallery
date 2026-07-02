"use client"

import { AudioSourceProvider } from "@/components/media/blocks/audio-player/components/audio-source"

const DEMO_SOURCE = [
  {
    id: "demo-track-1",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Big Buck Bunny",
    artistName: "Blender Foundation",
    albumName: "Open Movie Project",
    genre: "Animation",
    releaseYear: 2008,
    poster: "https://picsum.photos/seed/bbb/320/180",
  },
  {
    id: "demo-track-2",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Elephant's Dream",
    artistName: "Blender Foundation",
    albumName: "Open Movie Project",
    genre: "Animation",
    releaseYear: 2006,
    poster: "https://picsum.photos/seed/edream/320/180",
  },
]

export default function Demo() {
  return (
    <AudioSourceProvider source={DEMO_SOURCE}>
      <div className="flex flex-col gap-2 rounded-md border p-4">
        <span className="text-sm font-medium">音频源已加载</span>
        <span className="text-xs text-muted-foreground">
          共 {DEMO_SOURCE.length} 个音频资源已注入到播放 Store 中。
        </span>
      </div>
    </AudioSourceProvider>
  )
}
