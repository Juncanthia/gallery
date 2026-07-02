"use client"

import { useCallback, useEffect, useRef } from "react"

export type CubesProps = {
  gridSize?: number
  cubeSize?: number
  maxAngle?: number
  radius?: number
  easing?: string
  duration?: { enter: number; leave: number }
  cellGap?: number | { col?: number; row?: number }
  borderStyle?: string
  faceColor?: string
  shadow?: boolean | string
  autoAnimate?: boolean
  rippleOnClick?: boolean
  rippleColor?: string
  rippleSpeed?: number
}

export function Cubes({
  gridSize = 10,
  cubeSize,
  maxAngle = 45,
  radius = 3,
  easing = "power3.out",
  duration: durationProp,
  cellGap,
  borderStyle = "1px solid #fff",
  faceColor = "#120F17",
  shadow = false,
  autoAnimate = true,
  rippleOnClick = true,
  rippleColor = "#fff",
  rippleSpeed = 2,
}: CubesProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userActiveRef = useRef(false)
  const simPosRef = useRef({ x: 0, y: 0 })
  const simTargetRef = useRef({ x: 0, y: 0 })
  const simRAFRef = useRef<number | null>(null)

  const duration = durationProp ?? { enter: 0.3, leave: 0.6 }

  const colGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : cellGap?.col !== undefined
        ? `${cellGap.col}px`
        : "5%"
  const rowGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : cellGap?.row !== undefined
        ? `${cellGap.row}px`
        : "5%"

  const tiltAt = useCallback(
    (rowCenter: number, colCenter: number) => {
      if (!sceneRef.current) return
      sceneRef.current.querySelectorAll<HTMLElement>(".cube").forEach((cube) => {
        const r = +cube.dataset.row!
        const c = +cube.dataset.col!
        const dist = Math.hypot(r - rowCenter, c - colCenter)
        if (dist <= radius) {
          const pct = 1 - dist / radius
          const angle = pct * maxAngle
          cube.style.transition = `transform ${duration.enter}s ${easing}`
          cube.style.transform = `rotateX(${-angle}deg) rotateY(${angle}deg)`
        } else {
          cube.style.transition = `transform ${duration.leave}s ease-out`
          cube.style.transform = "rotateX(0deg) rotateY(0deg)"
        }
      })
    },
    [radius, maxAngle, duration, easing]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      userActiveRef.current = true
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      const rect = sceneRef.current!.getBoundingClientRect()
      const cellW = rect.width / gridSize
      const cellH = rect.height / gridSize
      const colCenter = (e.clientX - rect.left) / cellW
      const rowCenter = (e.clientY - rect.top) / cellH

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter))

      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false
      }, 3000)
    },
    [gridSize, tiltAt]
  )

  const resetAll = useCallback(() => {
    if (!sceneRef.current) return
    sceneRef.current.querySelectorAll<HTMLElement>(".cube").forEach((cube) => {
      cube.style.transition = `transform ${duration.leave}s ease-out`
      cube.style.transform = "rotateX(0deg) rotateY(0deg)"
    })
  }, [duration.leave])

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (!rippleOnClick || !sceneRef.current) return
      const rect = sceneRef.current.getBoundingClientRect()
      const cellW = rect.width / gridSize
      const cellH = rect.height / gridSize

      const colHit = Math.floor((e.clientX - rect.left) / cellW)
      const rowHit = Math.floor((e.clientY - rect.top) / cellH)

      const baseRingDelay = 0.15
      const baseAnimDur = 0.3
      const baseHold = 0.6

      const spreadDelay = baseRingDelay / rippleSpeed
      const animDuration = baseAnimDur / rippleSpeed
      const holdTime = baseHold / rippleSpeed

      const rings: Record<number, HTMLElement[]> = {}
      sceneRef.current.querySelectorAll<HTMLElement>(".cube").forEach((cube) => {
        const r = +cube.dataset.row!
        const c = +cube.dataset.col!
        const dist = Math.hypot(r - rowHit, c - colHit)
        const ring = Math.round(dist)
        if (!rings[ring]) rings[ring] = []
        rings[ring].push(cube)
      })

      Object.keys(rings)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((ring) => {
          const delay = ring * spreadDelay
          const faces = rings[ring].flatMap((cube) =>
            Array.from(cube.querySelectorAll<HTMLElement>(".cube-face"))
          )

          faces.forEach((face) => {
            face.style.transition = `background-color ${animDuration}s ease-out ${delay}s`
            face.style.backgroundColor = rippleColor
            setTimeout(() => {
              face.style.transition = `background-color ${animDuration}s ease-out`
              face.style.backgroundColor = faceColor
            }, (delay + animDuration + holdTime) * 1000)
          })
        })
    },
    [rippleOnClick, gridSize, faceColor, rippleColor, rippleSpeed]
  )

  useEffect(() => {
    if (!autoAnimate || !sceneRef.current) return
    simPosRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize }
    simTargetRef.current = { x: Math.random() * gridSize, y: Math.random() * gridSize }
    const speed = 0.02
    const loop = () => {
      if (!userActiveRef.current) {
        const pos = simPosRef.current
        const tgt = simTargetRef.current
        pos.x += (tgt.x - pos.x) * speed
        pos.y += (tgt.y - pos.y) * speed
        tiltAt(pos.y, pos.x)
        if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
          simTargetRef.current = {
            x: Math.random() * gridSize,
            y: Math.random() * gridSize,
          }
        }
      }
      simRAFRef.current = requestAnimationFrame(loop)
    }
    simRAFRef.current = requestAnimationFrame(loop)
    return () => {
      if (simRAFRef.current != null) cancelAnimationFrame(simRAFRef.current)
    }
  }, [autoAnimate, gridSize, tiltAt])

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerleave", resetAll)
    el.addEventListener("click", onClick)
    return () => {
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerleave", resetAll)
      el.removeEventListener("click", onClick)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [onPointerMove, resetAll, onClick])

  const cells = Array.from({ length: gridSize })
  const sceneStyle: React.CSSProperties = {
    gridTemplateColumns: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    columnGap: colGap,
    rowGap: rowGap,
  }
  const wrapperStyle: React.CSSProperties = {
    ...(cubeSize
      ? { width: `${gridSize * cubeSize}px`, height: `${gridSize * cubeSize}px` }
      : { width: "100%", height: "100%" }),
  }

  const faceBorder = borderStyle
  const faceBg = faceColor
  const faceShadow =
    shadow === true ? "0 0 6px rgba(0,0,0,.5)" : shadow || "none"

  return (
    <div className="mx-auto" style={wrapperStyle}>
      <div
        ref={sceneRef}
        className="grid touch-none"
        style={sceneStyle}
      >
        {cells.map((_, r) =>
          cells.map((__, c) => (
            <div key={`${r}-${c}`} className="cube" data-row={r} data-col={c}>
              <div
                className="cube-face cube-face--top absolute inset-0"
                style={{ border: faceBorder, background: faceBg, boxShadow: faceShadow }}
              />
              <div
                className="cube-face cube-face--bottom absolute inset-0"
                style={{ border: faceBorder, background: faceBg, boxShadow: faceShadow }}
              />
              <div
                className="cube-face cube-face--left absolute inset-0"
                style={{ border: faceBorder, background: faceBg, boxShadow: faceShadow }}
              />
              <div
                className="cube-face cube-face--right absolute inset-0"
                style={{ border: faceBorder, background: faceBg, boxShadow: faceShadow }}
              />
              <div
                className="cube-face cube-face--front absolute inset-0"
                style={{ border: faceBorder, background: faceBg, boxShadow: faceShadow }}
              />
              <div
                className="cube-face cube-face--back absolute inset-0"
                style={{ border: faceBorder, background: faceBg, boxShadow: faceShadow }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
