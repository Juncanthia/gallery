import { useMediaStore } from "@/_internals/domains/media/hooks/use-media"
import { useMediaApi } from "@/components/media/ui/media-provider"

export function useSeek() {
  const store = useMediaApi()
  const mediaElement = useMediaStore((state) => state.mediaElement)

  function seek(offset: number) {
    if (!mediaElement) {
      return
    }

    const media = mediaElement
    const newTime = media.currentTime + offset

    media.currentTime = Math.max(0, Math.min(newTime, media.duration || 0))

    store.setState(({ media }) => {
      media.idle = false
    })
  }

  return {
    seek,
  }
}
