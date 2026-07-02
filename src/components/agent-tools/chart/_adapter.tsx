/**
 * Adapter: UI and utility re-exports for copy-standalone portability.
 *
 * When copying this component to another project, update these imports
 * to match your project's paths:
 *
 *   cn    → Your Tailwind merge utility (e.g., "@/lib/utils", "~/lib/cn")
 *   Chart → shadcn/ui Chart (recharts wrapper)
 *   Card  → shadcn/ui Card
 */

export { cn } from "@/lib/utils";
export { ChartContainer } from "@/components/core/chart"
export { ChartTooltip } from "@/components/core/chart"
export { ChartTooltipContent } from "@/components/core/chart"
export { ChartLegend } from "@/components/core/chart"
export { ChartLegendContent } from "@/components/core/chart"
export { type ChartConfig } from "@/components/core/chart"
export { Card } from "@/components/core/card"
export { CardHeader } from "@/components/core/card"
export { CardTitle } from "@/components/core/card"
export { CardDescription } from "@/components/core/card"
export { CardContent } from "@/components/core/card"
