import * as React from "react";
import { cn } from "@/lib/utils";

export type WatermarkFont = {
  color?: string;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontStyle?: "normal" | "italic" | "oblique";
  fontFamily?: string;
  textAlign?: CanvasTextAlign;
}

export type WatermarkText = {
  text: string;
  font?: WatermarkFont;
}

export type WatermarkContent = string | WatermarkText;

export type WatermarkProps = Omit<React.ComponentProps<"div">, "content"> & {
  content?: WatermarkContent | WatermarkContent[];
  image?: string;
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: number;
  font?: WatermarkFont;
  gap?: [number, number];
  offset?: [number, number];
  inherit?: boolean;
  onRemove?: () => void;
  children?: React.ReactNode;
}

const DEFAULT_FONT: Required<WatermarkFont> = {
  color: "rgba(0,0,0,0.15)",
  fontSize: 16,
  fontWeight: "normal",
  fontStyle: "normal",
  fontFamily: "sans-serif",
  textAlign: "start",
};

function toLines(content?: WatermarkContent | WatermarkContent[], font?: WatermarkFont) {
  const contents = Array.isArray(content) ? content : [content ?? ""];

  return contents.map((item) => {
    if (typeof item === "string") {
      return { text: item, font: { ...DEFAULT_FONT, ...font } };
    }

    return { text: item.text, font: { ...DEFAULT_FONT, ...font, ...item.font } };
  });
}

function getCanvasFont(font: Required<WatermarkFont>) {
  const fontSize = typeof font.fontSize === "number" ? `${font.fontSize}px` : font.fontSize;
  return `${font.fontStyle} ${font.fontWeight} ${fontSize} ${font.fontFamily}`;
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
      font,
      gap = [100, 100],
      offset = [gap[0] / 2, gap[1] / 2],
      inherit = true,
      onRemove,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    void inherit;

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const contentLines = React.useMemo(() => toLines(content, font), [content, font]);

    const setRootRef = React.useCallback((node: HTMLDivElement | null) => {
      rootRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    }, [ref]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const ratio = window.devicePixelRatio || 1;
      const canvasWidth = width + gap[0];
      const canvasHeight = height + gap[1];

      canvas.width = canvasWidth * ratio;
      canvas.height = canvasHeight * ratio;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

      function updateWatermark() {
        const cvs = canvasRef.current;
        if (!cvs || !overlayRef.current) return;
        overlayRef.current.style.backgroundImage = `url(${cvs.toDataURL()})`;
        overlayRef.current.style.backgroundSize = `${canvasWidth}px ${canvasHeight}px`;
        overlayRef.current.style.backgroundPosition = `${offset[0] - gap[0] / 2}px ${offset[1] - gap[1] / 2}px`;
      }

      if (image) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.onload = () => {
          ctx.drawImage(img, offset[0], offset[1], width, height);
          updateWatermark();
        };
        img.onerror = () => {
          contentLines.forEach((line, index) => {
            ctx.fillStyle = line.font.color;
            ctx.font = getCanvasFont(line.font);
            ctx.textAlign = line.font.textAlign;
            ctx.textBaseline = "top";
            const lineHeight = (typeof line.font.fontSize === "string" ? parseInt(line.font.fontSize) : line.font.fontSize) + 8;
            ctx.fillText(line.text, offset[0], offset[1] + index * lineHeight);
          });
          updateWatermark();
        };
        img.src = image;
      } else {
        contentLines.forEach((line, index) => {
          ctx.fillStyle = line.font.color;
          ctx.font = getCanvasFont(line.font);
          ctx.textAlign = line.font.textAlign;
          ctx.textBaseline = "top";
          const lineHeight = (typeof line.font.fontSize === "string" ? parseInt(line.font.fontSize) : line.font.fontSize) + 8;
          ctx.fillText(line.text, offset[0], offset[1] + index * lineHeight);
        });
        updateWatermark();
      }
    }, [contentLines, gap, height, image, offset, rotate, width]);

    React.useEffect(() => {
      if (!onRemove || typeof MutationObserver === "undefined") {
        return undefined;
      }

      const root = rootRef.current;
      const overlay = overlayRef.current;
      if (!root || !overlay) {
        return undefined;
      }

      const observer = new MutationObserver((mutations) => {
        const removed = mutations.some((mutation) => (
          Array.from(mutation.removedNodes).includes(overlay)
        ));

        if (!removed) {
          return;
        }

        onRemove();

        if (!overlay.parentElement) {
          root.insertBefore(overlay, canvasRef.current?.nextSibling ?? root.firstChild);
        }
      });

      observer.observe(root, { childList: true });

      return () => observer.disconnect();
    }, [onRemove]);

    return (
      <div
        ref={setRootRef}
        data-slot="watermark"
        className={cn("relative overflow-hidden", className)}
        style={style}
        {...props}
      >
        <canvas ref={canvasRef} className="hidden" />
        <div
          ref={overlayRef}
          data-slot="watermark-overlay"
          className="pointer-events-none absolute inset-0"
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
