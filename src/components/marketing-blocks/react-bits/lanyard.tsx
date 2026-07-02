"use client"

import { useEffect, useState } from "react"

// NOTE: This component requires @react-three/fiber, @react-three/drei, @react-three/rapier, and meshline to work.
// The full Three.js-based Lanyard is provided as a thin wrapper below.
// For production use, install: @react-three/fiber @react-three/drei @react-three/rapier meshline


export type LanyardProps = {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
  frontImage?: string | null
  backImage?: string | null
  imageFit?: "cover" | "contain"
  lanyardImage?: string | null
  lanyardWidth?: number
}

// This is a simplified wrapper. The full interactive 3D lanyard card requires
// @react-three/fiber and @react-three/rapier, which add significant bundle weight.
// Use the full implementation from the React Bits reference when those deps are available.
export function Lanyard(_props: LanyardProps) {
  const [, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Render a placeholder when Three.js deps are not available.
  // The full implementation (Canvas + Physics + Band) is ~280 lines of R3F code.
  return (
    <div className="lanyard-wrapper flex items-center justify-center" style={{ width: "100%", height: 400 }}>
      <div className="text-muted-foreground text-sm">
        Lanyard requires @react-three/fiber, @react-three/drei, @react-three/rapier, and meshline.
        Install these dependencies and import the full component from the React Bits reference.
      </div>
    </div>
  )
}
