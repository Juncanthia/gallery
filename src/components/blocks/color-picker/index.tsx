"use client";

import Color from "color";
import { CheckIcon, PipetteIcon } from "lucide-react";
import { Slider } from "radix-ui";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, type ButtonProps } from "@/components/core/button";
import { Input } from "@/components/core/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/core/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/core/tooltip";
import { cn } from "@/lib/utils";

export type ColorPickerFormatMode = "hex" | "rgb" | "css" | "hsl" | "hsb";

type HslaColor = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
};

type RgbaTuple = [number, number, number, number];

type EyeDropperResult = {
  sRGBHex: string;
};

type EyeDropperConstructor = new () => {
  open: (options?: { signal?: AbortSignal }) => Promise<EyeDropperResult>;
};

declare global {
  interface Window {
    EyeDropper?: EyeDropperConstructor;
  }
}

const colorPickerFormats: ColorPickerFormatMode[] = [
  "hex",
  "rgb",
  "css",
  "hsl",
  "hsb",
];

const defaultPresets = [
  "#111827",
  "#52525b",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0891b2",
  "#2563eb",
  "#4f46e5",
  "#9333ea",
  "#db2777",
  "#ffffff",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHue(value: number) {
  return ((value % 360) + 360) % 360;
}

function parseColor(value: Parameters<typeof Color>[0], fallback = "#000000") {
  try {
    return Color(value ?? fallback);
  } catch {
    return Color(fallback);
  }
}

function parseColorStrict(value: Parameters<typeof Color>[0]) {
  try {
    return Color(value);
  } catch {
    return undefined;
  }
}

function parseHsbString(value: string): HslaColor | undefined {
  const match = value
    .trim()
    .match(
      /^hsba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*(\d?(?:\.\d+)?))?\s*\)$/i
    );

  if (!match) return undefined;

  const hue = normalizeHue(Number(match[1]));
  const saturation = clamp(Number(match[2]), 0, 100);
  const valueChannel = clamp(Number(match[3]), 0, 100);
  const alpha = clamp(match[4] ? Number(match[4]) : 1, 0, 1);
  const color = Color.hsv(hue, saturation, valueChannel).alpha(alpha).hsl();
  const [h, s, l] = color.array();

  return {
    hue: h || 0,
    saturation: s || 0,
    lightness: l || 0,
    alpha: color.alpha(),
  };
}

function colorToHsla(
  value: Parameters<typeof Color>[0],
  fallback = "#000000"
): HslaColor {
  if (typeof value === "string") {
    const hsb = parseHsbString(value);
    if (hsb) return hsb;
  }

  const color = parseColor(value, fallback).hsl();
  const [hue, saturation, lightness] = color.array();

  return {
    hue: normalizeHue(hue || 0),
    saturation: clamp(saturation || 0, 0, 100),
    lightness: clamp(lightness || 0, 0, 100),
    alpha: clamp(color.alpha(), 0, 1),
  };
}

function hslaToColor({ hue, saturation, lightness, alpha }: HslaColor) {
  return Color.hsl(hue, saturation, lightness).alpha(alpha);
}

function hslaToRgbaTuple(color: HslaColor): RgbaTuple {
  const rgb = hslaToColor(color).rgb().array();

  return [
    Math.round(rgb[0] ?? 0),
    Math.round(rgb[1] ?? 0),
    Math.round(rgb[2] ?? 0),
    color.alpha,
  ];
}

function formatColor(color: HslaColor, mode: ColorPickerFormatMode) {
  const colorValue = hslaToColor(color);
  const alpha = color.alpha;

  if (mode === "hex") {
    return alpha < 1 ? colorValue.hexa().toLowerCase() : colorValue.hex().toLowerCase();
  }

  if (mode === "rgb") {
    const [red, green, blue] = colorValue.rgb().array().map(Math.round);
    return alpha < 1
      ? `rgba(${red}, ${green}, ${blue}, ${Number(alpha.toFixed(2))})`
      : `rgb(${red}, ${green}, ${blue})`;
  }

  if (mode === "css") {
    const [red, green, blue] = colorValue.rgb().array().map(Math.round);
    return `rgba(${red}, ${green}, ${blue}, ${Number(alpha.toFixed(2))})`;
  }

  if (mode === "hsl") {
    return alpha < 1
      ? `hsla(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%, ${Number(alpha.toFixed(2))})`
      : `hsl(${Math.round(color.hue)}, ${Math.round(color.saturation)}%, ${Math.round(color.lightness)}%)`;
  }

  const hsv = colorValue.hsv().array();
  const hue = Math.round(hsv[0] ?? 0);
  const saturation = Math.round(hsv[1] ?? 0);
  const value = Math.round(hsv[2] ?? 0);

  return alpha < 1
    ? `hsba(${hue}, ${saturation}%, ${value}%, ${Number(alpha.toFixed(2))})`
    : `hsb(${hue}, ${saturation}%, ${value}%)`;
}

function parseColorText(value: string, fallback: HslaColor) {
  const hsb = parseHsbString(value);
  if (hsb) return hsb;

  const color = parseColorStrict(value);
  if (!color) return fallback;

  return colorToHsla(color);
}

function hslToFieldPosition(color: HslaColor) {
  const hsv = hslaToColor(color).hsv().array();

  return {
    saturation: clamp(hsv[1] ?? 0, 0, 100),
    value: clamp(hsv[2] ?? 0, 0, 100),
  };
}

function fieldPositionToHsla(
  hue: number,
  saturation: number,
  value: number,
  alpha: number
) {
  const color = Color.hsv(hue, saturation, value).alpha(alpha).hsl();
  const [nextHue, nextSaturation, nextLightness] = color.array();

  return {
    hue: normalizeHue(nextHue || 0),
    saturation: clamp(nextSaturation || 0, 0, 100),
    lightness: clamp(nextLightness || 0, 0, 100),
    alpha,
  };
}

type ColorPickerContextValue = HslaColor & {
  disabled?: boolean;
  mode: ColorPickerFormatMode;
  readOnly?: boolean;
  setAlpha: (alpha: number) => void;
  setColor: (color: HslaColor) => void;
  setColorFromString: (color: string) => void;
  setHue: (hue: number) => void;
  setLightness: (lightness: number) => void;
  setMode: (mode: ColorPickerFormatMode) => void;
  setSaturation: (saturation: number) => void;
};

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);

  if (!context) {
    throw new Error("useColorPicker must be used within a ColorPicker");
  }

  return context;
};

export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
  defaultFormat?: ColorPickerFormatMode;
  defaultValue?: Parameters<typeof Color>[0];
  disabled?: boolean;
  format?: ColorPickerFormatMode;
  name?: string;
  onChange?: (value: RgbaTuple) => void;
  onFormatChange?: (format: ColorPickerFormatMode) => void;
  onValueChange?: (value: string) => void;
  readOnly?: boolean;
  required?: boolean;
  value?: Parameters<typeof Color>[0];
};

export const ColorPicker = ({
  value,
  defaultValue = "#000000",
  defaultFormat = "hex",
  disabled,
  format,
  name,
  onChange,
  onFormatChange,
  onValueChange,
  readOnly,
  required,
  className,
  ...props
}: ColorPickerProps) => {
  const [color, setColorState] = useState(() =>
    colorToHsla(value ?? defaultValue)
  );
  const [internalMode, setInternalMode] =
    useState<ColorPickerFormatMode>(defaultFormat);
  const mode = format ?? internalMode;

  useEffect(() => {
    if (value !== undefined) {
      setColorState(colorToHsla(value, String(defaultValue)));
    }
  }, [defaultValue, value]);

  const setMode = useCallback(
    (nextMode: ColorPickerFormatMode) => {
      setInternalMode(nextMode);
      onFormatChange?.(nextMode);
    },
    [onFormatChange]
  );

  const emitColor = useCallback(
    (nextColor: HslaColor) => {
      onChange?.(hslaToRgbaTuple(nextColor));
      onValueChange?.(formatColor(nextColor, mode));
    },
    [mode, onChange, onValueChange]
  );

  const setColor = useCallback(
    (nextColor: HslaColor) => {
      const normalizedColor = {
        hue: normalizeHue(nextColor.hue),
        saturation: clamp(nextColor.saturation, 0, 100),
        lightness: clamp(nextColor.lightness, 0, 100),
        alpha: clamp(nextColor.alpha, 0, 1),
      };

      setColorState(normalizedColor);
      emitColor(normalizedColor);
    },
    [emitColor]
  );

  const setColorFromString = useCallback(
    (nextColor: string) => {
      const parsedColor = parseColorText(nextColor, color);
      if (parsedColor) setColor(parsedColor);
    },
    [color, setColor]
  );

  const setHue = useCallback(
    (hue: number) => setColor({ ...color, hue }),
    [color, setColor]
  );
  const setSaturation = useCallback(
    (saturation: number) => setColor({ ...color, saturation }),
    [color, setColor]
  );
  const setLightness = useCallback(
    (lightness: number) => setColor({ ...color, lightness }),
    [color, setColor]
  );
  const setAlpha = useCallback(
    (alpha: number) => setColor({ ...color, alpha: alpha / 100 }),
    [color, setColor]
  );

  const contextValue = useMemo<ColorPickerContextValue>(
    () => ({
      ...color,
      disabled,
      mode,
      readOnly,
      setAlpha,
      setColor,
      setColorFromString,
      setHue,
      setLightness,
      setMode,
      setSaturation,
    }),
    [
      color,
      disabled,
      mode,
      readOnly,
      setAlpha,
      setColor,
      setColorFromString,
      setHue,
      setLightness,
      setMode,
      setSaturation,
    ]
  );

  return (
    <ColorPickerContext.Provider value={contextValue}>
      <div
        data-slot="color-picker"
        className={cn("flex size-full flex-col gap-4", className)}
        {...props}
      />
      {name ? (
        <input
          type="hidden"
          name={name}
          value={formatColor(color, "hex")}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
        />
      ) : null}
    </ColorPickerContext.Provider>
  );
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = memo(
  ({ className, ...props }: ColorPickerSelectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const {
      alpha,
      disabled,
      hue,
      lightness,
      readOnly,
      saturation,
      setColor,
    } = useColorPicker();
    const fieldPosition = hslToFieldPosition({
      hue,
      saturation,
      lightness,
      alpha,
    });

    const backgroundGradient = useMemo(() => {
      return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`;
    }, [hue]);

    const handlePointerMove = useCallback(
      (event: PointerEvent) => {
        if (!(isDragging && containerRef.current)) {
          return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);

        setColor(fieldPositionToHsla(hue, x * 100, y * 100, alpha));
      },
      [alpha, hue, isDragging, setColor]
    );

    useEffect(() => {
      const handlePointerUp = () => setIsDragging(false);

      if (isDragging) {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, [isDragging, handlePointerMove]);

    return (
      <div
        data-slot="color-picker-selection"
        aria-disabled={disabled || undefined}
        className={cn(
          "relative size-full cursor-crosshair rounded",
          (disabled || readOnly) && "pointer-events-none opacity-50",
          className
        )}
        onPointerDown={(event) => {
          if (disabled || readOnly) return;
          event.preventDefault();
          setIsDragging(true);
          handlePointerMove(event.nativeEvent);
        }}
        ref={containerRef}
        style={{
          background: backgroundGradient,
        }}
        {...props}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
          style={{
            left: `${fieldPosition.saturation}%`,
            top: `${100 - fieldPosition.value}%`,
            backgroundColor: formatColor(
              { hue, saturation, lightness, alpha },
              "hex"
            ),
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    );
  }
);

ColorPickerSelection.displayName = "ColorPickerSelection";

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { disabled, hue, readOnly, setHue } = useColorPicker();

  return (
    <Slider.Root
      data-slot="color-picker-hue"
      className={cn("relative flex h-4 w-full touch-none", className)}
      disabled={disabled || readOnly}
      max={360}
      onValueChange={([nextHue]) => {
        if (nextHue !== undefined) setHue(nextHue);
      }}
      step={1}
      value={[hue]}
      {...props}
    >
      <Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
};

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { alpha, disabled, hue, lightness, readOnly, saturation, setAlpha } =
    useColorPicker();
  const solidColor = formatColor({ hue, saturation, lightness, alpha: 1 }, "rgb");

  return (
    <Slider.Root
      data-slot="color-picker-alpha"
      className={cn("relative flex h-4 w-full touch-none", className)}
      disabled={disabled || readOnly}
      max={100}
      onValueChange={([nextAlpha]) => {
        if (nextAlpha !== undefined) setAlpha(nextAlpha);
      }}
      step={1}
      value={[Math.round(alpha * 100)]}
      {...props}
    >
      <Slider.Track
        className="relative my-0.5 h-3 w-full grow overflow-hidden rounded-full"
        style={{
          background:
            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
          backgroundSize: "8px 8px",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(to right, transparent, ${solidColor})`,
          }}
        />
        <Slider.Range className="absolute h-full rounded-full bg-transparent" />
      </Slider.Track>
      <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
};

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export const ColorPickerEyeDropper = ({
  className,
  disabled,
  children,
  ...props
}: ColorPickerEyeDropperProps) => {
  const { alpha, disabled: contextDisabled, readOnly, setColorFromString } =
    useColorPicker();
  const isSupported =
    typeof window !== "undefined" && typeof window.EyeDropper === "function";

  if (!isSupported) return null;

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) return;

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const color = parseColor(result.sRGBHex).alpha(alpha);

      setColorFromString(color.hexa());
    } catch (error) {
      console.warn("EyeDropper failed:", error);
    }
  };

  return (
    <Button
      data-slot="color-picker-eye-dropper"
      className={cn("shrink-0 text-muted-foreground", className)}
      disabled={disabled || contextDisabled || readOnly}
      htmlType="button"
      onClick={handleEyeDropper}
      shape={children ? "default" : "square"}
      variant="outlined"
      {...props}
    >
      {children ?? <PipetteIcon size={16} />}
    </Button>
  );
};

export type ColorPickerOutputProps = Omit<
  ComponentProps<typeof Select>,
  "onValueChange" | "value"
> & {
  className?: string;
  triggerClassName?: string;
  triggerSize?: ComponentProps<typeof SelectTrigger>["size"];
};

export const ColorPickerOutput = ({
  className,
  triggerClassName,
  triggerSize = "sm",
  ...props
}: ColorPickerOutputProps) => {
  const { disabled, mode, readOnly, setMode } = useColorPicker();

  return (
    <Select
      value={mode}
      onValueChange={(value) => {
        if (value) setMode(value as ColorPickerFormatMode);
      }}
      disabled={disabled || readOnly}
      {...props}
    >
      <SelectTrigger
        size={triggerSize}
        className={cn("h-8 w-20 shrink-0 text-xs", triggerClassName, className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false}>
        {colorPickerFormats.map((format) => (
          <SelectItem key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

type PercentageInputProps = ComponentProps<typeof Input>;

const PercentageInput = ({ className, ...props }: PercentageInputProps) => {
  return (
    <div className="relative">
      <Input
        readOnly
        type="text"
        {...props}
        className={cn(
          "h-8 w-[3.25rem] rounded-l-none bg-secondary px-2 text-xs shadow-none",
          className
        )}
      />
      <span className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground text-xs">
        %
      </span>
    </div>
  );
};

export type ColorPickerInputProps = Omit<
  ComponentProps<typeof Input>,
  "onChange" | "value"
> & {
  format?: ColorPickerFormatMode;
};

export const ColorPickerInput = ({
  className,
  format,
  onBlur,
  ...props
}: ColorPickerInputProps) => {
  const {
    alpha,
    disabled,
    hue,
    lightness,
    mode,
    readOnly,
    saturation,
    setColorFromString,
  } = useColorPicker();
  const currentColor = useMemo(
    () => ({ hue, saturation, lightness, alpha }),
    [alpha, hue, lightness, saturation]
  );
  const inputFormat = format ?? mode;
  const formattedValue = formatColor(currentColor, inputFormat);
  const [draft, setDraft] = useState(formattedValue);

  useEffect(() => {
    setDraft(formattedValue);
  }, [formattedValue]);

  return (
    <Input
      data-slot="color-picker-input"
      className={cn("h-8 font-mono text-xs", className)}
      disabled={disabled}
      readOnly={readOnly}
      spellCheck={false}
      value={draft}
      onChange={(event) => {
        const nextValue = event.target.value;
        setDraft(nextValue);

        try {
          setColorFromString(nextValue);
        } catch {
          return;
        }
      }}
      onBlur={(event) => {
        setDraft(formatColor(currentColor, inputFormat));
        onBlur?.(event);
      }}
      {...props}
    />
  );
};

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerFormat = ({
  className,
  ...props
}: ColorPickerFormatProps) => {
  const { alpha, hue, lightness, mode, saturation } = useColorPicker();
  const color = hslaToColor({ hue, saturation, lightness, alpha });
  const alphaPercent = Math.round(alpha * 100);

  if (mode === "hex") {
    return (
      <div
        data-slot="color-picker-format"
        className={cn(
          "-space-x-px relative flex w-full items-center rounded-md shadow-sm",
          className
        )}
        {...props}
      >
        <Input
          className="h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none"
          readOnly
          type="text"
          value={formatColor({ hue, saturation, lightness, alpha }, "hex")}
        />
        <PercentageInput value={alphaPercent} />
      </div>
    );
  }

  if (mode === "rgb") {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value));

    return (
      <div
        data-slot="color-picker-format"
        className={cn(
          "-space-x-px flex items-center rounded-md shadow-sm",
          className
        )}
        {...props}
      >
        {rgb.map((value, index) => (
          <Input
            className={cn(
              "h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none",
              index && "rounded-l-none"
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alphaPercent} />
      </div>
    );
  }

  if (mode === "css") {
    return (
      <div
        data-slot="color-picker-format"
        className={cn("w-full rounded-md shadow-sm", className)}
        {...props}
      >
        <Input
          className="h-8 w-full bg-secondary px-2 text-xs shadow-none"
          readOnly
          type="text"
          value={formatColor({ hue, saturation, lightness, alpha }, "css")}
        />
      </div>
    );
  }

  if (mode === "hsl") {
    const hsl = color
      .hsl()
      .array()
      .map((value) => Math.round(value));

    return (
      <div
        data-slot="color-picker-format"
        className={cn(
          "-space-x-px flex items-center rounded-md shadow-sm",
          className
        )}
        {...props}
      >
        {hsl.map((value, index) => (
          <Input
            className={cn(
              "h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none",
              index && "rounded-l-none"
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alphaPercent} />
      </div>
    );
  }

  const hsv = color
    .hsv()
    .array()
    .map((value) => Math.round(value));

  return (
    <div
      data-slot="color-picker-format"
      className={cn("-space-x-px flex items-center rounded-md shadow-sm", className)}
      {...props}
    >
      {hsv.map((value, index) => (
        <Input
          className={cn(
            "h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none",
            index && "rounded-l-none"
          )}
          key={index}
          readOnly
          type="text"
          value={value}
        />
      ))}
      <PercentageInput value={alphaPercent} />
    </div>
  );
};

export type ColorPickerSwatchProps = HTMLAttributes<HTMLDivElement> & {
  value?: Parameters<typeof Color>[0];
};

export const ColorPickerSwatch = ({
  className,
  value,
  style,
  ...props
}: ColorPickerSwatchProps) => {
  const context = useContext(ColorPickerContext);
  const color = value
    ? colorToHsla(value)
    : context
      ? {
          hue: context.hue,
          saturation: context.saturation,
          lightness: context.lightness,
          alpha: context.alpha,
        }
      : colorToHsla("#000000");
  const formattedColor = formatColor(color, "css");

  return (
    <div
      data-slot="color-picker-swatch"
      role="img"
      aria-label={`Current color: ${formatColor(color, "hex")}`}
      className={cn("size-8 rounded-sm border shadow-sm", className)}
      style={{
        background:
          color.alpha < 1
            ? `linear-gradient(${formattedColor}, ${formattedColor}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0% 50% / 8px 8px`
            : formattedColor,
        forcedColorAdjust: "none",
        ...style,
      }}
      {...props}
    />
  );
};

export type ColorPickerPresetsProps = HTMLAttributes<HTMLDivElement> & {
  presets?: readonly string[];
};

export const ColorPickerPresets = ({
  className,
  presets = defaultPresets,
  ...props
}: ColorPickerPresetsProps) => {
  const {
    alpha,
    disabled,
    hue,
    lightness,
    readOnly,
    saturation,
    setColorFromString,
  } = useColorPicker();
  const selectedColor = formatColor(
    { hue, saturation, lightness, alpha },
    "hex"
  ).slice(0, 7);

  return (
    <div
      data-slot="color-picker-presets"
      className={cn("grid grid-cols-6 gap-1.5", className)}
      {...props}
    >
      {presets.map((preset) => {
        const normalizedPreset = preset.toLowerCase();
        const isSelected = selectedColor === normalizedPreset;

        return (
          <button
            key={preset}
            type="button"
            className={cn(
              "grid size-6 place-items-center rounded-full border shadow-xs transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              isSelected && "ring-2 ring-ring ring-offset-2"
            )}
            disabled={disabled || readOnly}
            style={{ backgroundColor: preset }}
            aria-label={`Use ${preset}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setColorFromString(preset)}
          >
            {isSelected ? (
              <CheckIcon
                className={cn(
                  "size-3.5",
                  normalizedPreset === "#ffffff"
                    ? "text-foreground"
                    : "text-white"
                )}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export type ColorPickerPanelProps = Omit<
  ColorPickerProps,
  "children" | "onChange" | "onValueChange" | "value"
> & {
  color?: Parameters<typeof Color>[0];
  label?: string;
  onChange?: (color: string) => void;
  onValueChange?: (color: string) => void;
  presets?: readonly string[];
  showAlpha?: boolean;
  showEyeDropper?: boolean;
  showFormatSelect?: boolean;
  showPresets?: boolean;
  value?: Parameters<typeof Color>[0];
};

export const ColorPickerPanel = ({
  className,
  color,
  defaultValue,
  label,
  onChange,
  onValueChange,
  presets,
  showAlpha = false,
  showEyeDropper = false,
  showFormatSelect = true,
  showPresets = true,
  value,
  ...props
}: ColorPickerPanelProps) => {
  const currentValue = value ?? color;

  return (
    <ColorPicker
      value={currentValue}
      defaultValue={defaultValue}
      onValueChange={(nextColor) => {
        onChange?.(nextColor);
        onValueChange?.(nextColor);
      }}
      className={cn("w-full gap-2", className)}
      {...props}
    >
      {showFormatSelect ? (
        <div className="flex justify-end">
          <ColorPickerOutput triggerClassName="h-7 w-24 text-xs" />
        </div>
      ) : null}
      <ColorPickerSelection className="h-32 overflow-hidden rounded" />
      <ColorPickerHue />
      {showAlpha ? <ColorPickerAlpha /> : null}
      <div className="flex items-center gap-2">
        <ColorPickerInput
          aria-label={label ? `${label} value` : "Color value"}
          className="min-w-0 flex-1"
        />
        {showEyeDropper ? <ColorPickerEyeDropper /> : null}
      </div>
      {showPresets ? <ColorPickerPresets presets={presets} /> : null}
    </ColorPicker>
  );
};

export type ColorPickerTriggerButtonProps = Omit<
  ButtonProps,
  "children" | "color" | "icon" | "onChange" | "value"
> & {
  align?: ComponentProps<typeof PopoverContent>["align"];
  color: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  label: string;
  onChange: (color: string) => void;
  panelClassName?: string;
  presets?: readonly string[];
  side?: ComponentProps<typeof PopoverContent>["side"];
};

export const ColorPickerTriggerButton = ({
  align = "start",
  color,
  contentClassName,
  disabled,
  icon,
  label,
  onChange,
  panelClassName,
  presets,
  side,
  className,
  ...props
}: ColorPickerTriggerButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              htmlType="button"
              variant="text"
              size="small"
              shape="square"
              disabled={disabled}
              aria-label={label}
              className={cn("relative", className)}
              {...props}
            >
              {icon}
              <span
                className="absolute right-1 bottom-1 h-1 w-4 rounded-full border border-background"
                style={{ backgroundColor: color }}
              />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
      <PopoverContent
        align={align}
        side={side}
        className={cn("z-40 w-72 p-2", contentClassName)}
      >
        <ColorPickerPanel
          color={color}
          label={label}
          onChange={onChange}
          presets={presets}
          className={panelClassName}
        />
      </PopoverContent>
    </Popover>
  );
};

export const ColorPickerArea = ColorPickerSelection;
export const ColorPickerHueSlider = ColorPickerHue;
export const ColorPickerAlphaSlider = ColorPickerAlpha;
export const ColorPickerFormatSelect = ColorPickerOutput;
export const ColorPickerContent = PopoverContent;
export const ColorPickerTrigger = PopoverTrigger;
