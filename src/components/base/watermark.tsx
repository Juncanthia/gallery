import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type WatermarkProps = Omit<React.ComponentProps<"div">, "content"> & {
  content?: string | string[];
  image?: string;
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: number;
  font?: {
    color?: string;
    fontSize?: number | string;
    fontWeight?: string;
    fontFamily?: string;
  };
  gap?: [number, number];
  offset?: [number, number];
  children?: React.ReactNode;
}

export const Watermark = React.forwardRef<HTMLDivElement, WatermarkProps>(
  (
    {
      content,
      image,
      width = 120,
      height = 64,
      rotate = -22,
      zIndex = 9,
      font = {},
      gap = [100, 100],
      offset = [gap[0] / 2, gap[1] / 2],
      children,
      className,
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const canvasWidth = width + gap[0];
      const canvasHeight = height + gap[1];

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

      ctx.globalAlpha = 0.15;

      if (image) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, offset[0], offset[1], width, height);
          updateWatermark();
        };
        img.src = image;
      } else {
        const lines = Array.isArray(content) ? content : [content || ""];
        ctx.fillStyle = font?.color ?? "rgba(0,0,0,0.15)";
        ctx.font = `${font?.fontWeight ?? "normal"} ${font?.fontSize ?? 16}px ${font?.fontFamily ?? "sans-serif"}`;
        ctx.textAlign = "start";
        ctx.textBaseline = "top";

        const lineHeight = (typeof font?.fontSize === "string" ? parseInt(font.fontSize) : font?.fontSize ?? 16) + 8;

        lines.forEach((line, i) => {
          ctx.fillText(line, offset[0], offset[1] + i * lineHeight);
        });

        updateWatermark();
      }

      function updateWatermark() {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const dataUrl = cvs.toDataURL();
        if (overlayRef.current) {
          overlayRef.current.style.backgroundImage = `url(${dataUrl})`;
        }
      }
    }, [content, image, width, height, rotate, font, gap, offset]);

    return (
      <div
        ref={ref}
        data-slot="watermark"
        className={cn("relative", className)}
        {...props}
      >
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundRepeat: "repeat",
            zIndex,
          }}
        />
        {children}
      </div>
    );
  }
);

Watermark.displayName = "Watermark";
