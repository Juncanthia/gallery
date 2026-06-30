"use client"

import { useEffect } from "react"

import { Playlist } from "@/components/ui/limeplay-playlist"
import { usePlaylist } from "@/components/limeplay/hooks/use-playlist"

const DEMO_ITEMS = [
  {
    id: "demo-1",
    properties: {
      description: "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel.",
      poster: "https://picsum.photos/seed/bbb/320/180",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      title: "Big Buck Bunny",
      year: "2008",
    },
  },
  {
    id: "demo-2",
    properties: {
      description: "Friends Proog and Emo journey through a strange world inside a giant machine.",
      poster: "https://picsum.photos/seed/edream/320/180",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      title: "Elephant's Dream",
      year: "2006",
    },
  },
  {
    id: "demo-3",
    properties: {
      description: "HBO GO now works with Chromecast — the easiest way to enjoy online video.",
      poster: "https://picsum.photos/seed/blazes/320/180",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      title: "For Bigger Blazes",
      year: "2015",
    },
  },
]

export default function Demo() {
  const { load } = usePlaylist()

  useEffect(() => {
    load(DEMO_ITEMS, 0)
  }, [load])

  return <Playlist />
}
