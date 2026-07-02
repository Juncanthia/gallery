/**
 * UI and utility re-exports for copy-standalone portability.
 *
 * This file centralizes dependencies so the component can be easily
 * copied to another project by updating these imports to match the target
 * project's paths.
 */
export { cn } from "@/_internals/foundations/utils/cn";

export { Button } from "@/components/core/button";
export type { ButtonColor, ButtonVariant } from "@/components/core/button";
export { Card } from "@/components/core/card";
export { ChevronLeft, ChevronRight } from "lucide-react";
