"use client"

import { useRef, useEffect } from "react"

export type ImageTrailProps = {
  items?: string[]
  variant?: number
}

export function ImageTrail({ items = [], variant = 1 }: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return

    const container = containerRef.current
    const images = [...container.querySelectorAll<HTMLElement>(".content__img")]

    let imgPosition = 0
    let zIndexVal = 1
    let activeImagesCount = 0
    let isIdle = true
    const threshold = 80

    const mousePos = { x: 0, y: 0 }
    const lastMousePos = { x: 0, y: 0 }
    const cacheMousePos = { x: 0, y: 0 }

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b
    const getMouseDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
      Math.hypot(p1.x - p2.x, p1.y - p2.y)

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect()
      let clientX: number, clientY: number
      if ("touches" in ev && ev.touches.length > 0) {
        clientX = ev.touches[0].clientX
        clientY = ev.touches[0].clientY
      } else {
        clientX = (ev as MouseEvent).clientX
        clientY = (ev as MouseEvent).clientY
      }
      mousePos.x = clientX - rect.left
      mousePos.y = clientY - rect.top
    }

    const showNextImage = () => {
      ++zIndexVal
      imgPosition = imgPosition < images.length - 1 ? imgPosition + 1 : 0
      const img = images[imgPosition]

      const imgRect = img.getBoundingClientRect()
      const iw = imgRect.width
      const ih = imgRect.height

      activeImagesCount++
      isIdle = false

      // Reset and position
      img.style.opacity = "1"
      img.style.scale = "1"
      img.style.zIndex = String(zIndexVal)
      img.style.transform = `translate(${cacheMousePos.x - iw / 2}px, ${cacheMousePos.y - ih / 2}px)`

      img.style.transition = "transform 0.4s, opacity 0.4s, scale 0.4s"
      requestAnimationFrame(() => {
        img.style.transform = `translate(${mousePos.x - iw / 2}px, ${mousePos.y - ih / 2}px)`
        setTimeout(() => {
          img.style.transition = "transform 0.4s, opacity 0.4s, scale 0.4s"
          img.style.opacity = "0"
          img.style.scale = "0.2"
          setTimeout(() => {
            activeImagesCount--
            if (activeImagesCount === 0) isIdle = true
          }, 400)
        }, 400)
      })
    }

    const render = () => {
      const distance = getMouseDistance(mousePos, lastMousePos)
      cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.1)
      cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.1)

      if (distance > threshold) {
        showNextImage()
        lastMousePos.x = mousePos.x
        lastMousePos.y = mousePos.y
      }
      if (isIdle && zIndexVal !== 1) zIndexVal = 1

      requestAnimationFrame(() => render())
    }

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect()
      let clientX: number, clientY: number
      if ("touches" in ev && ev.touches.length > 0) {
        clientX = ev.touches[0].clientX
        clientY = ev.touches[0].clientY
      } else {
        clientX = (ev as MouseEvent).clientX
        clientY = (ev as MouseEvent).clientY
      }
      mousePos.x = clientX - rect.left
      mousePos.y = clientY - rect.top
      cacheMousePos.x = mousePos.x
      cacheMousePos.y = mousePos.y

      requestAnimationFrame(() => render())
      container.removeEventListener("mousemove", initRender)
      container.removeEventListener("touchmove", initRender)
    }

    container.addEventListener("mousemove", handlePointerMove)
    container.addEventListener("touchmove", handlePointerMove)
    container.addEventListener("mousemove", initRender)
    container.addEventListener("touchmove", initRender)
  }, [variant, items])

  return (
    <div
      ref={containerRef}
      className="relative h-[400px] w-full overflow-hidden rounded-lg bg-neutral-900"
    >
      {items.map((url, i) => (
        <div
          key={i}
          className="content__img pointer-events-none absolute rounded-lg bg-cover bg-center opacity-0"
          style={{
            width: "200px",
            height: "250px",
            backgroundImage: `url(${url})`,
          }}
        />
      ))}
    </div>
  )
}
