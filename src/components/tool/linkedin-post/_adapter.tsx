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

export { cn } from "@hyper/shadcn";
export { Button } from "@hyper/shadcn";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@hyper/shadcn";
