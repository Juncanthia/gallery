import { BlobCursor } from "@/components/ui/blob-cursor"

export default function BlobCursorBasicExample() {
  return (
    <div className="relative h-[400px] w-full rounded-lg bg-neutral-900">
      <BlobCursor />
      <div className="flex h-full items-center justify-center text-neutral-400">
        Move cursor to see blobs
      </div>
    </div>
  )
}
