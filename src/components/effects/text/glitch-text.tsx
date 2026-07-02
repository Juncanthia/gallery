"use client"

import { useId } from "react"
import { cn } from "@/_internals/foundations/utils/cn"

export type GlitchTextProps = {
  children: string
  speed?: number
  enableShadows?: boolean
  enableOnHover?: boolean
  className?: string
}

export function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}: GlitchTextProps) {
  const id = useId().replace(/:/g, "-")
  const afterDuration = `${speed * 3}s`
  const beforeDuration = `${speed * 2}s`
  const afterShadow = enableShadows ? "-5px 0 red" : "none"
  const beforeShadow = enableShadows ? "5px 0 cyan" : "none"

  return (
    <>
      <style>{`
        @keyframes ${id} {
          0% { clip-path: inset(20% 0 50% 0); }
          5% { clip-path: inset(10% 0 60% 0); }
          10% { clip-path: inset(15% 0 55% 0); }
          15% { clip-path: inset(25% 0 35% 0); }
          20% { clip-path: inset(30% 0 40% 0); }
          25% { clip-path: inset(40% 0 20% 0); }
          30% { clip-path: inset(10% 0 60% 0); }
          35% { clip-path: inset(15% 0 55% 0); }
          40% { clip-path: inset(25% 0 35% 0); }
          45% { clip-path: inset(30% 0 40% 0); }
          50% { clip-path: inset(20% 0 50% 0); }
          55% { clip-path: inset(10% 0 60% 0); }
          60% { clip-path: inset(15% 0 55% 0); }
          65% { clip-path: inset(25% 0 35% 0); }
          70% { clip-path: inset(30% 0 40% 0); }
          75% { clip-path: inset(40% 0 20% 0); }
          80% { clip-path: inset(20% 0 50% 0); }
          85% { clip-path: inset(10% 0 60% 0); }
          90% { clip-path: inset(15% 0 55% 0); }
          95% { clip-path: inset(25% 0 35% 0); }
          100% { clip-path: inset(30% 0 40% 0); }
        }
        .glitch-${id}::before,
        .glitch-${id}::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          color: inherit;
          overflow: hidden;
        }
        ${enableOnHover ? `
        .glitch-${id}::after,
        .glitch-${id}::before {
          content: "";
          opacity: 0;
          animation: none;
        }
        .glitch-${id}:hover::after {
          content: attr(data-text);
          opacity: 1;
          left: 10px;
          text-shadow: ${afterShadow};
          animation: ${id} ${afterDuration} infinite linear alternate-reverse;
        }
        .glitch-${id}:hover::before {
          content: attr(data-text);
          opacity: 1;
          left: -10px;
          text-shadow: ${beforeShadow};
          animation: ${id} ${beforeDuration} infinite linear alternate-reverse;
        }
        ` : `
        .glitch-${id}::after {
          left: 10px;
          text-shadow: ${afterShadow};
          animation: ${id} ${afterDuration} infinite linear alternate-reverse;
        }
        .glitch-${id}::before {
          left: -10px;
          text-shadow: ${beforeShadow};
          animation: ${id} ${beforeDuration} infinite linear alternate-reverse;
        }
        `}
      `}</style>
      <span
        data-slot="glitch-text"
        className={cn(
          `glitch-${id}`,
          "relative mx-auto inline-block cursor-pointer select-none whitespace-nowrap font-black",
          "text-[clamp(2rem,10vw,8rem)] text-white",
          className
        )}
        data-text={children}
      >
        {children}
      </span>
    </>
  )
}
