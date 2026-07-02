/**
 * Adapter: UI and utility re-exports for copy-standalone portability.
 *
 * When copying this component to another project, update these imports
 * to match your project's paths:
 *
 *   cn      → Your Tailwind merge utility (e.g., "@/lib/utils", "~/lib/cn")
 *   Button  → shadcn/ui Button
 *   Tooltip → shadcn/ui Tooltip
 */

export { cn } from "@/_internals/foundations/utils/cn";
export { Button } from "@/components/core/button";
export { Tooltip } from "@/components/core/tooltip"
export { TooltipContent } from "@/components/core/tooltip"
export { TooltipProvider } from "@/components/core/tooltip"
export { TooltipTrigger } from "@/components/core/tooltip"
