import { FadeContent } from "@/components/ui/rb-fade-content"

export default function FadeContentBasicExample() {
  return (
    <FadeContent blur={false} duration={1000}>
      <div className="rounded-lg bg-neutral-800 p-8 text-center text-white">
        <h2 className="text-xl font-bold">Fade Content</h2>
        <p className="mt-2 text-neutral-400">This content fades in on scroll</p>
      </div>
    </FadeContent>
  )
}
