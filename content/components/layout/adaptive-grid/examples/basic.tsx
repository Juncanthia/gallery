import { AdaptiveGrid, AdaptiveCard } from "@/components/layout/adaptive-grid"

export default function Demo() {
  return (
    <div className="w-full py-8">
      <AdaptiveGrid>
        <AdaptiveCard
          image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
          title="Mountain Sunrise"
        >
          Golden light breaks over snow-capped peaks, painting the sky in shades
          of amber and rose.
        </AdaptiveCard>
        <AdaptiveCard
          image="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop"
          title="Autumn Valley"
        >
          A quiet valley draped in crimson and gold as the last leaves fall.
        </AdaptiveCard>
        <AdaptiveCard title="Text-Only Card">
          This card has no image and renders as a simple flex column layout,
          adapting its structure based on content.
        </AdaptiveCard>
        <AdaptiveCard
          image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
          title="Forest Path"
        >
          Sunlight filters through the canopy, illuminating a winding trail
          through ancient woods.
        </AdaptiveCard>
        <AdaptiveCard
          image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"
          title="Misty Hills"
        >
          Rolling hills emerge from morning mist, their silhouettes soft against
          the horizon.
        </AdaptiveCard>
      </AdaptiveGrid>
    </div>
  )
}
