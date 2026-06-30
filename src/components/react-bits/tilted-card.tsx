"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
}

export type TiltedCardProps = {
  imageSrc: string
  altText?: string
  captionText?: string
  containerHeight?: string
  containerWidth?: string
  imageHeight?: string
  imageWidth?: string
  scaleOnHover?: number
  rotateAmplitude?: number
  showMobileWarning?: boolean
  showTooltip?: boolean
  overlayContent?: React.ReactNode
  displayOverlayContent?: boolean
}

export function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)
  const opacity = useSpring(0)
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  })

  const [lastY, setLastY] = useState(0)

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

    rotateX.set(rotationX)
    rotateY.set(rotationY)

    const velocityY = offsetY - lastY
    rotateFigcaption.set(-velocityY * 0.6)
    setLastY(offsetY)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
    opacity.set(1)
  }

  function handleMouseLeave() {
    opacity.set(0)
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    rotateFigcaption.set(0)
  }

  return (
    <figure
      ref={ref}
      className="relative overflow-hidden"
      style={{
        height: containerHeight,
        width: containerWidth,
        perspective: "800px",
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 p-4 text-center text-sm text-white md:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative mx-auto"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="block w-full object-cover"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-black/40">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute z-20 rounded bg-black/80 px-3 py-1.5 text-sm text-white"
          style={{
            x: useMotionValue(0),
            y: useMotionValue(0),
            opacity,
            rotate: rotateFigcaption,
            top: 0,
            left: 0,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  )
}
