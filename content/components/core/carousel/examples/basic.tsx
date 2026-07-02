import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/core/carousel"
import { Card, CardContent } from "@/components/core/card"

export default function CarouselBasicExample() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((i) => (
          <CarouselItem key={i}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-2xl font-semibold">{i}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
