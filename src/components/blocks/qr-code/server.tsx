import QR from "qrcode";
import type { HTMLAttributes, ReactNode } from "react";
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
  overlay?: ReactNode;
  size?: number;
};

export const QRCode = async ({
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
  const qrValue = value ?? data ?? "";

  if (!qrValue) {
    throw new Error("QRCode requires data or value");
  }

  const svg = await QR.toString(qrValue, {
    type: "svg",
    color: {
      dark: foreground ?? foregroundColor ?? "#000000",
      light: background ?? backgroundColor ?? "#ffffff",
    },
    width: size,
    errorCorrectionLevel: level ?? robustness,
    margin,
  });

  if (!svg) {
    throw new Error("Failed to generate QR code");
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        "[&_svg]:size-full",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <span
        className="size-full"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required for SVG"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
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

export type { QRCodeLevel };
