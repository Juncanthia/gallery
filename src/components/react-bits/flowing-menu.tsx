"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"

import { cn } from "@/lib/utils"

type FlowingMenuItem = {
  link: string
  text: string
  image: string
}

export type FlowingMenuProps = {
  items?: FlowingMenuItem[]
  speed?: number
  textColor?: string
  bgColor?: string
  marqueeBgColor?: string
  marqueeTextColor?: string
  borderColor?: string
}

function MenuItem({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: FlowingMenuItem & {
  speed: number
  textColor: string
  marqueeBgColor: string
  marqueeTextColor: string
  borderColor: string
}) {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [repetitions, setRepetitions] = useState(4)

  const animationDefaults = { duration: 0.6, ease: "expo" }

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - 0) ** 2
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom"
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector(".marquee__part") as HTMLElement | null
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(4, needed))
    }

    calculateRepetitions()
    window.addEventListener("resize", calculateRepetitions)
    return () => window.removeEventListener("resize", calculateRepetitions)
  }, [text, image])

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector(".marquee__part") as HTMLElement | null
      if (!marqueeContent) return
      const contentWidth = marqueeContent.offsetWidth
      if (contentWidth === 0) return
      if (animationRef.current) animationRef.current.kill()
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      })
    }

    const timer = setTimeout(setupMarquee, 50)
    return () => {
      clearTimeout(timer)
      if (animationRef.current) animationRef.current.kill()
    }
  }, [text, image, repetitions, speed])

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0)
  }

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
  }

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="menu__item-link"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </a>
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FlowingMenu({
  items = [],
  speed = 15,
  textColor = "#fff",
  bgColor = "#120F17",
  marqueeBgColor = "#fff",
  marqueeTextColor = "#120F17",
  borderColor = "#fff",
}: FlowingMenuProps) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  )
}
