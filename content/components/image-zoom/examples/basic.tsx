import { ImageZoom } from "@/components/ui/image-zoom"

export default function ImageZoomBasicExample() {
  return (
    <ImageZoom>
      <img
        alt="Sample landscape photo of mountains at sunset"
        src="https://picsum.photos/id/1015/800/600"
        width={400}
        height={300}
        className="rounded-md object-cover"
      />
    </ImageZoom>
  )
}
