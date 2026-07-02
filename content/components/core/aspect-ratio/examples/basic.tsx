import { AspectRatio } from "@/components/core/aspect-ratio"

export default function AspectRatioBasicExample() {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-4">
      <AspectRatio ratio={16 / 9} className="rounded bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          16:9
        </div>
      </AspectRatio>
      <AspectRatio ratio={4 / 3} className="rounded bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          4:3
        </div>
      </AspectRatio>
      <AspectRatio ratio={1} className="rounded bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          1:1
        </div>
      </AspectRatio>
      <AspectRatio ratio={3 / 4} className="rounded bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          3:4
        </div>
      </AspectRatio>
    </div>
  )
}
