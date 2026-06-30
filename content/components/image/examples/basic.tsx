import { Image } from "@/components/ui/image"

export default function ImageBasicExample() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Image
        src="https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=200&h=200&fit=crop"
        alt="示例图片"
        width={100}
        height={100}
        className="rounded"
      />
      <Image
        src="https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=200&h=200&fit=crop"
        alt="圆形图片"
        width={80}
        height={80}
        className="rounded-full"
      />
    </div>
  )
}
