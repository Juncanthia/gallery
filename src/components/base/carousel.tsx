import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/button"
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  items?: CarouselItemOption[]
  arrows?: boolean
  dots?: boolean | { className?: string }
  dotPlacement?: "top" | "bottom" | "start" | "end"
  autoplay?: boolean | { dotDuration?: boolean }
  autoplaySpeed?: number
  beforeChange?: (current: number, next: number) => void
  afterChange?: (current: number) => void
  contentClassName?: string
  itemClassName?: string
}

type CarouselItemOption = {
  key?: React.Key
  content: React.ReactNode
  className?: string
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  items,
  arrows = true,
  dots = true,
  dotPlacement = "bottom",
  autoplay = false,
  autoplaySpeed = 3000,
  beforeChange,
  afterChange,
  contentClassName,
  itemClassName,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const selectedIndexRef = React.useRef(0)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return

    const nextIndex = api.selectedScrollSnap()
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(nextIndex)
    setScrollSnaps(api.scrollSnapList())

    if (selectedIndexRef.current !== nextIndex) {
      selectedIndexRef.current = nextIndex
      afterChange?.(nextIndex)
    }
  }, [afterChange])

  const scrollPrev = React.useCallback(() => {
    if (!api) return

    const current = api.selectedScrollSnap()
    const next = Math.max(0, current - 1)
    beforeChange?.(current, next)
    api.scrollPrev()
  }, [api, beforeChange])

  const scrollNext = React.useCallback(() => {
    if (!api) return

    const current = api.selectedScrollSnap()
    const next = api.canScrollNext() ? current + 1 : 0
    beforeChange?.(current, next)
    if (api.canScrollNext()) {
      api.scrollNext()
    } else {
      api.scrollTo(0)
    }
  }, [api, beforeChange])

  const scrollTo = React.useCallback((index: number) => {
    if (!api) return

    const current = api.selectedScrollSnap()
    beforeChange?.(current, index)
    api.scrollTo(index)
  }, [api, beforeChange])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    const frame = window.requestAnimationFrame(() => onSelect(api))
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      window.cancelAnimationFrame(frame)
      api.off("reInit", onSelect)
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  React.useEffect(() => {
    if (!api || !autoplay) return undefined

    const timer = window.setInterval(() => {
      if (document.hidden) return

      const current = api.selectedScrollSnap()
      const next = api.canScrollNext() ? current + 1 : 0
      beforeChange?.(current, next)
      api.scrollTo(next)
    }, autoplaySpeed)

    return () => window.clearInterval(timer)
  }, [api, autoplay, autoplaySpeed, beforeChange])

  const renderedChildren = items ? (
    <>
      <CarouselContent className={contentClassName}>
        {items.map((item, index) => (
          <CarouselItem
            key={item.key ?? index}
            className={cn(itemClassName, item.className)}
          >
            {item.content}
          </CarouselItem>
        ))}
      </CarouselContent>
      {arrows && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </>
  ) : (
    children
  )

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {renderedChildren}
        {dots ? <CarouselDots dots={dots} placement={dotPlacement} autoplay={autoplay} autoplaySpeed={autoplaySpeed} /> : null}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselDots({
  dots,
  placement,
  autoplay,
  autoplaySpeed,
}: {
  dots: true | { className?: string }
  placement: NonNullable<CarouselProps["dotPlacement"]>
  autoplay: CarouselProps["autoplay"]
  autoplaySpeed: number
}) {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()
  const showDuration = typeof autoplay === "object" && autoplay.dotDuration

  if (scrollSnaps.length <= 1) {
    return null
  }

  return (
    <div
      data-slot="carousel-dots"
      data-placement={placement}
      className={cn(
        "absolute z-10 flex items-center justify-center gap-2",
        placement === "bottom" && "right-3 bottom-3 left-3",
        placement === "top" && "top-3 right-3 left-3",
        placement === "start" && "top-3 bottom-3 left-3 flex-col",
        placement === "end" && "top-3 right-3 bottom-3 flex-col",
        typeof dots === "object" && dots.className
      )}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          data-slot="carousel-dot"
          data-active={selectedIndex === index || undefined}
          className={cn(
            "relative h-1.5 w-5 overflow-hidden rounded-full bg-muted-foreground/30 transition-colors hover:bg-muted-foreground/50",
            selectedIndex === index && "bg-primary"
          )}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={selectedIndex === index ? "true" : undefined}
          onClick={() => scrollTo(index)}
        >
          {showDuration && selectedIndex === index ? (
            <span
              className="absolute inset-y-0 left-0 bg-primary-foreground/60"
              style={{ width: "100%", transition: `width ${autoplaySpeed}ms linear` }}
            />
          ) : null}
        </button>
      ))}
    </div>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outlined",
  size = "small",
  shape = "circle",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      shape={shape}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "inset-y-0 -left-12 my-auto"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outlined",
  size = "small",
  shape = "circle",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      shape={shape}
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "inset-y-0 -right-12 my-auto"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselItemOption,
}
