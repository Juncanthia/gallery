import { ImageTrail } from "@/components/ui/rb-image-trail"

export default function ImageTrailBasicExample() {
  return (
    <ImageTrail
      items={[
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=250&fit=crop",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=250&fit=crop",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=200&h=250&fit=crop",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=250&fit=crop",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=250&fit=crop",
      ]}
    />
  )
}
