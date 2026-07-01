"use client";

import { formatHex, oklch } from "culori";
import QR from "qrcode";
import type * as React from "react";
import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type QRCodeLevel = "L" | "M" | "Q" | "H";

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
  data?: string;
  value?: string;
  foreground?: string;
  foregroundColor?: string;
  background?: string;
  backgroundColor?: string;
  robustness?: QRCodeLevel;
  level?: QRCodeLevel;
  margin?: number;
  overlay?: React.ReactNode;
  size?: number;
};

const oklchRegex = /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/;

const getOklch = (color: string, fallback: [number, number, number]) => {
  const oklchMatch = color.match(oklchRegex);

  if (!oklchMatch) {
    return { l: fallback[0], c: fallback[1], h: fallback[2] };
  }

  return {
    l: Number.parseFloat(oklchMatch[1]),
    c: Number.parseFloat(oklchMatch[2]),
    h: Number.parseFloat(oklchMatch[3]),
  };
};

export const QRCode = ({
  data,
  value,
  foreground,
  foregroundColor,
  background,
  backgroundColor,
  robustness = "M",
  level,
  margin = 0,
  overlay,
  size = 200,
  className,
  style,
  ...props
}: QRCodeProps) => {
  const [svg, setSVG] = useState<string | null>(null);
  const qrValue = value ?? data ?? "";
  const errorCorrectionLevel = level ?? robustness;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const styles = getComputedStyle(document.documentElement);
        const resolvedForegroundColor =
          foreground ?? foregroundColor ?? styles.getPropertyValue("--foreground");
        const resolvedBackgroundColor =
          background ?? backgroundColor ?? styles.getPropertyValue("--background");

        const foregroundOklch = getOklch(
          resolvedForegroundColor,
          [0.21, 0.006, 285.885]
        );
        const backgroundOklch = getOklch(resolvedBackgroundColor, [0.985, 0, 0]);

        const newSvg = await QR.toString(qrValue, {
          type: "svg",
          color: {
            dark: formatHex(oklch({ mode: "oklch", ...foregroundOklch })),
            light: formatHex(oklch({ mode: "oklch", ...backgroundOklch })),
          },
          width: size,
          errorCorrectionLevel,
          margin,
        });

        setSVG(newSvg);
      } catch (err) {
        console.error(err);
      }
    };

    if (qrValue) {
      generateQR();
    }
  }, [background, backgroundColor, errorCorrectionLevel, foreground, foregroundColor, margin, qrValue, size]);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        "[&_svg]:size-full",
        !svg && "animate-pulse bg-accent",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {svg ? (
        <span
          className="size-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SVG"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : null}
      {overlay ? (
        <span
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm bg-background"
          data-slot="qr-code-overlay"
        >
          {overlay}
        </span>
      ) : null}
    </div>
  );
};

export type QRCodeDownloadProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  data?: string;
  value?: string;
  fileName?: string;
  format?: "png" | "svg";
  foreground?: string;
  background?: string;
  robustness?: QRCodeLevel;
  level?: QRCodeLevel;
  margin?: number;
  size?: number;
};

export function QRCodeDownload({
  data,
  value,
  fileName = "qr-code",
  format = "svg",
  foreground = "#000000",
  background = "#ffffff",
  robustness = "M",
  level,
  margin = 0,
  size = 200,
  children,
  onClick,
  ...props
}: QRCodeDownloadProps) {
  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    const qrValue = value ?? data;
    if (!qrValue) {
      return;
    }

    const errorCorrectionLevel = level ?? robustness;
    const url =
      format === "svg"
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            await QR.toString(qrValue, {
              type: "svg",
              color: { dark: foreground, light: background },
              errorCorrectionLevel,
              margin,
              width: size,
            })
          )}`
        : await QR.toDataURL(qrValue, {
            color: { dark: foreground, light: background },
            errorCorrectionLevel,
            margin,
            width: size,
          });

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.${format}`;
    link.click();
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children ?? `Download ${format.toUpperCase()}`}
    </button>
  );
}

export type { QRCodeLevel };
