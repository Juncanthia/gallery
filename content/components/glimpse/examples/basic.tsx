import {
  Glimpse,
  GlimpseTrigger,
  GlimpseContent,
  GlimpseImage,
  GlimpseTitle,
  GlimpseDescription,
} from "@/components/ui/glimpse"

export default function GlimpseBasicExample() {
  return (
    <Glimpse>
      <GlimpseTrigger asChild>
        <a
          href="#"
          className="font-medium underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-foreground transition-colors"
        >
          Understanding React Concurrent Mode
        </a>
      </GlimpseTrigger>
      <GlimpseContent className="w-72">
        <GlimpseImage
          src="https://picsum.photos/id/1/600/315"
          alt="React Concurrent Mode diagram"
        />
        <GlimpseTitle>Understanding React Concurrent Mode</GlimpseTitle>
        <GlimpseDescription>
          How React 18 concurrent features transform rendering patterns,
          enabling smoother user experiences with automatic batching and
          interruptible rendering.
        </GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  )
}
