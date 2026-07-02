"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import type * as React from "react";

import { cn } from "@/_internals/foundations/utils/cn";

export interface LegacySliderProps
	extends Omit<
		React.ComponentProps<typeof SliderPrimitive.Root>,
		"defaultValue" | "onValueChange" | "onValueCommit" | "value"
	> {
	defaultValue?: number;
	onValueChange?: (value: number) => void;
	onValueCommit?: (value: number) => void;
	value?: number;
}

export function LegacySlider({
	className,
	defaultValue,
	max = 100,
	min = 0,
	onValueChange,
	onValueCommit,
	value,
	...props
}: LegacySliderProps) {
	const resolvedValue = typeof value === "number" ? [value] : undefined;
	const resolvedDefaultValue =
		typeof defaultValue === "number" ? [defaultValue] : [min];

	return (
		<SliderPrimitive.Root
			className={cn(
				"relative flex h-[22px] w-full min-w-[220px] touch-none select-none items-center",
				className,
			)}
			defaultValue={resolvedDefaultValue}
			max={max}
			min={min}
			onValueChange={(nextValue) => {
				onValueChange?.(nextValue[0] ?? min);
			}}
			onValueCommit={(nextValue) => {
				onValueCommit?.(nextValue[0] ?? min);
			}}
			value={resolvedValue}
			{...props}
		>
			<SliderPrimitive.Track className="relative mx-[6px] h-[9px] grow overflow-hidden rounded-[5px] border border-[#828282] bg-[linear-gradient(180deg,#b8b8b8_0%,#ffffff_100%)] shadow-[inset_0_1px_1px_rgba(0,0,0,0.2),inset_0_-3px_2px_rgba(255,255,255,0.1)]">
				<SliderPrimitive.Range className="absolute h-full rounded-[5px] border border-[#1e386b] bg-[linear-gradient(180deg,#2e59a8_0%,#6d9fe8_100%)] shadow-[inset_0_1px_1px_rgba(0,0,0,0.2),inset_0_-3px_2px_rgba(255,255,255,0.1)]" />
			</SliderPrimitive.Track>

			<SliderPrimitive.Thumb className="relative block size-[21px] rounded-full border border-[#8b8b8b] bg-[linear-gradient(180deg,#ffffff_0%,#ededed_55%,#bcbcbc_100%)] shadow-[0_1px_2px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-[#8fb5ff]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
				<span className="absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,#fafafa_0%,#ececec_52%,#cacaca_100%)]" />
				<span className="absolute inset-[2px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.42)_42%,rgba(255,255,255,0.08)_70%,rgba(255,255,255,0)_100%)]" />
			</SliderPrimitive.Thumb>
		</SliderPrimitive.Root>
	);
}
