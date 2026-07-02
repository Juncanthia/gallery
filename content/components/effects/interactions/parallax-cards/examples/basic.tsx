import { ParallaxCard, ParallaxCards } from "@/components/effects/interactions/parallax-cards"

export default function Demo() {
  return (
    <ParallaxCards>
      <ParallaxCard intensity={0.3}>
        <h3 className="text-lg font-semibold">Card One</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Scroll to see the parallax entrance animation. Cards fade in and
          translate upward as they enter the viewport.
        </p>
      </ParallaxCard>
      <ParallaxCard intensity={0.5}>
        <h3 className="text-lg font-semibold">Card Two</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Higher intensity values produce more dramatic translation and scale
          effects.
        </p>
      </ParallaxCard>
      <ParallaxCard intensity={0.7}>
        <h3 className="text-lg font-semibold">Card Three</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Powered by CSS scroll-driven animations with the view() timeline
          — no JavaScript animation library required.
        </p>
      </ParallaxCard>
    </ParallaxCards>
  )
}
