"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"

import { cn } from "@/_internals/foundations/utils/cn"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string
type ThemeKey = keyof typeof THEMES
type ThemeColors = Partial<Record<ThemeKey, string[]>>
type AtLeastOneThemeColor = {
  [K in ThemeKey]: Required<Pick<ThemeColors, K>> &
    Partial<Omit<ThemeColors, K>>
}[ThemeKey]

const VALID_THEME_KEYS = Object.keys(THEMES) as ThemeKey[]

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never; colors?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string>; colors?: never }
    | { color?: never; theme?: never; colors: AtLeastOneThemeColor }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function validateChartConfig(config: ChartConfig): void {
  for (const [key, value] of Object.entries(config)) {
    if (!("colors" in value) || !value.colors) {
      continue
    }

    const hasValidThemeKey = VALID_THEME_KEYS.some(
      (themeKey) => value.colors?.[themeKey] !== undefined
    )

    if (!hasValidThemeKey) {
      throw new Error(
        `Invalid chart config for "${key}": colors must include at least one theme key (${VALID_THEME_KEYS.join(", ")}).`
      )
    }
  }
}

type ChartContainerProps = Omit<React.ComponentProps<"div">, "children"> &
  Pick<
    React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>,
    | "children"
    | "initialDimension"
    | "aspect"
    | "debounce"
    | "minHeight"
    | "minWidth"
    | "maxHeight"
    | "height"
    | "width"
    | "onResize"
  > & {
    config: ChartConfig
    footer?: React.ReactNode
    innerResponsiveContainerStyle?: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["style"]
  }

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  footer,
  innerResponsiveContainerStyle,
  aspect,
  debounce,
  minHeight,
  minWidth,
  maxHeight,
  height,
  width,
  onResize,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  validateChartConfig(config)

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "relative flex min-h-0 w-full flex-1 justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          footer ? "flex-col" : "aspect-video",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          aspect={aspect}
          debounce={debounce}
          minHeight={minHeight}
          minWidth={minWidth}
          maxHeight={maxHeight}
          height={height}
          initialDimension={initialDimension}
          onResize={onResize}
          style={innerResponsiveContainerStyle}
          width={width}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
        {footer}
      </div>
    </ChartContext.Provider>
  )
}

function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="flex items-center justify-center gap-2 rounded-md border bg-background px-2 py-0.5 text-primary text-sm">
        <div className="h-3 w-3 animate-spin rounded-full border border-border border-t-primary" />
        <span>Loading</span>
      </div>
    </div>
  )
}

function distributeColors(colors: string[], maxCount: number): string[] {
  if (colors.length >= maxCount) {
    return colors.slice(0, maxCount)
  }

  const result: string[] = []
  const baseSlots = Math.floor(maxCount / colors.length)
  const extraSlots = maxCount % colors.length

  for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
    const isExtraColor = colorIndex >= colors.length - extraSlots
    const slotCount = baseSlots + (isExtraColor ? 1 : 0)
    for (let slotIndex = 0; slotIndex < slotCount; slotIndex++) {
      const color = colors[colorIndex]
      if (color) {
        result.push(color)
      }
    }
  }

  return result
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color ?? config.colors
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .flatMap(([key, itemConfig]) => {
    if (itemConfig.colors) {
      const colors = itemConfig.colors[theme as keyof typeof itemConfig.colors]
      if (!colors?.length) {
        return []
      }

      return distributeColors(colors, getColorsCount(itemConfig)).map(
        (color, index) => `  --color-${key}-${index}: ${color};`
      )
    }

    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? [`  --color-${key}: ${color};`] : []
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  selected,
  roundness = "lg",
  variant = "default",
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    selected?: string | null
    roundness?: "sm" | "md" | "lg" | "xl"
    variant?: "default" | "frosted-glass"
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 border border-border/50 px-2.5 py-1.5 text-xs shadow-xl",
        roundness === "sm" && "rounded-sm",
        roundness === "md" && "rounded-md",
        roundness === "lg" && "rounded-lg",
        roundness === "xl" && "rounded-xl",
        variant === "default" && "bg-background",
        variant === "frosted-glass" && "bg-background/70 backdrop-blur-sm",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color ?? item.payload?.fill ?? item.color
            const colorCount = itemConfig ? getColorsCount(itemConfig) : 1

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                  selected != null && selected !== item.dataKey && "opacity-30"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={getIndicatorColorStyle(
                            key,
                            colorCount,
                            indicatorColor
                          )}
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

function getIndicatorColorStyle(
  dataKey: string,
  colorCount: number,
  fallbackColor?: string
): React.CSSProperties {
  if (colorCount <= 1) {
    return {
      "--color-bg": fallbackColor ?? `var(--color-${dataKey}-0)`,
      "--color-border": fallbackColor ?? `var(--color-${dataKey}-0)`,
    } as React.CSSProperties
  }

  const stops = Array.from({ length: colorCount }, (_, index) => {
    const offset = (index / (colorCount - 1)) * 100
    return `var(--color-${dataKey}-${index}) ${offset}%`
  }).join(", ")

  return {
    "--color-bg": `linear-gradient(to right, ${stops})`,
    "--color-border": fallbackColor ?? `var(--color-${dataKey}-0)`,
  } as React.CSSProperties
}

function axisValueToPercentFormatter(value: number) {
  return `${Math.round(value * 100).toFixed(0)}%`
}

function getColorsCount(config: ChartConfig[string]): number {
  if (!("colors" in config) || !config.colors) {
    return 1
  }

  const counts = VALID_THEME_KEYS.map(
    (theme) => config.colors?.[theme]?.length ?? 0
  )
  return Math.max(...counts, 1)
}

const getLoadingData = (points = 10, min = 0, max = 70) => {
  const range = max - min
  return Array.from({ length: points }, () => ({
    loading: Math.floor(Math.random() * range) + min,
  }))
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  LoadingIndicator,
  axisValueToPercentFormatter,
  getColorsCount,
  getLoadingData,
  getPayloadConfigFromPayload,
  useChart,
}
