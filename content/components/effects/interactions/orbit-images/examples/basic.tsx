import { OrbitImages } from "@/components/effects/interactions/orbit-images"

const demoImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=64&h=64&fit=crop",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=64&h=64&fit=crop",
]

export default function OrbitImagesBasicExample() {
  return (
    <div className="flex items-center justify-center p-8">
      <OrbitImages
        images={demoImages}
        width={400}
        height={400}
        shape="ellipse"
        radiusX={200}
        radiusY={80}
      />
    </div>
  )
}
