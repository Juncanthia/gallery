/**
 * Adapter: UI and utility re-exports for copy-standalone portability.
 *
 * When copying this component to another project, update these imports
 * to match your project's paths:
 *
 *   cn          → Your Tailwind merge utility (e.g., "@/lib/utils", "~/lib/cn")
 *   Accordion   → shadcn/ui Accordion
 *   Card        → shadcn/ui Card
 *   Collapsible → shadcn/ui Collapsible
 */

export { cn } from "@/_internals/foundations/utils/cn";
export { Accordion } from "@/components/core/accordion"
export { AccordionItem } from "@/components/core/accordion"
export { AccordionTrigger } from "@/components/core/accordion"
export { AccordionContent } from "@/components/core/accordion"
export { Card } from "@/components/core/card"
export { CardHeader } from "@/components/core/card"
export { CardTitle } from "@/components/core/card"
export { CardDescription } from "@/components/core/card"
export { CardContent } from "@/components/core/card"
export { CardFooter } from "@/components/core/card"
export { Collapsible } from "@/components/core/collapsible"
export { CollapsibleTrigger } from "@/components/core/collapsible"
export { CollapsibleContent } from "@/components/core/collapsible"
