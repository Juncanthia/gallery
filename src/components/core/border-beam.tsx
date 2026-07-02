import { motion } from "motion/react";
import { cn } from "@/_internals/foundations/utils/cn";

interface BorderBeamProps {
  duration?: number;
  size?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  className?: string;
}

function BorderBeam({
  duration = 8,
  size = 200,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  className,
}: BorderBeamProps) {
  return (
    <div
      data-slot="border-beam"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      <motion.div
        style={{
          position: "absolute",
          width: size / 2,
          height: size / 2,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${colorFrom}, ${colorTo})`,
          filter: "blur(4px)",
          opacity: 0.8,
        }}
        animate={{
          x: ["0%", "100%", "100%", "0%", "0%"],
          y: ["0%", "0%", "100%", "100%", "0%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export { BorderBeam };
export type { BorderBeamProps };
