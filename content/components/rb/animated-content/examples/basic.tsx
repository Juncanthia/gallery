import { AnimatedContent } from "@/components/ui/rb-animated-content"

export default function AnimatedContentBasicExample() {
  return (
    <AnimatedContent
      distance={50}
      direction="vertical"
      reverse={false}
    >
      <div className="rounded-lg bg-neutral-800 p-8 text-center text-white">
        <h2 className="text-xl font-bold">Animated Content</h2>
        <p className="mt-2 text-neutral-400">This content animates in on scroll</p>
      </div>
    </AnimatedContent>
  )
}
