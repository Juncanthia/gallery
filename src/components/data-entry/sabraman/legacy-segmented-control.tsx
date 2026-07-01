"use client";

import * as React from "react";

import { cn } from "@/components/_shared/sabraman/lib/utils";

const SEGMENT_ACTIVE_BACKGROUND =
	"linear-gradient(180deg, rgb(162, 178, 201) 0%, rgb(121, 142, 172) 33%, rgb(80, 109, 148) 67%, rgb(64, 95, 138) 100%)";
const SEGMENT_INACTIVE_BACKGROUND =
	"linear-gradient(180deg, rgb(177, 193, 213) 0%, rgb(145, 163, 187) 33%, rgb(114, 138, 169) 67%, rgb(96, 125, 160) 100%)";

export interface LegacySegmentedControlItem<T extends string = string> {
	label: string;
	value: T;
	width?: number;
}

export interface LegacySegmentedControlProps<T extends string = string>
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	items: readonly LegacySegmentedControlItem<T>[];
	onValueChange: (value: T) => void;
	value: T;
}

export function LegacySegmentedControl<T extends string = string>({
	className,
	items,
	onValueChange,
	style,
	value,
	...props
}: LegacySegmentedControlProps<T>) {
	return (
		<div
			className={cn(
				"relative inline-flex items-start overflow-hidden rounded-[5px] shadow-[0px_0.5px_0.5px_0px_rgba(255,255,255,0.4)]",
				className,
			)}
			role="tablist"
			style={{
				...style,
				fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
			}}
			{...props}
		>
			{items.map((item, index) => {
				const isActive = item.value === value;

				return (
					<React.Fragment key={item.value}>
						<button
							aria-selected={isActive}
							className="relative flex h-[29px] min-w-[54px] items-center justify-center px-[5px] transition-[filter] duration-150 hover:brightness-105"
							onClick={() => {
								onValueChange(item.value);
							}}
							role="tab"
							style={{
								backgroundImage: isActive
									? SEGMENT_ACTIVE_BACKGROUND
									: SEGMENT_INACTIVE_BACKGROUND,
								width: item.width,
							}}
							type="button"
						>
							<span className="relative z-[1] flex min-h-px min-w-px flex-1 flex-col justify-center text-center font-bold text-[12px] text-white [text-shadow:0px_-1px_0px_rgba(0,0,0,0.4)]">
								{item.label}
							</span>
						</button>
						{index < items.length - 1 ? (
							<span
								aria-hidden="true"
								className="w-px self-stretch bg-[rgba(0,0,0,0.25)]"
							/>
						) : null}
					</React.Fragment>
				);
			})}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_1px_0px_black,inset_0px_1px_0.5px_0px_rgba(0,0,0,0.4)]"
			/>
		</div>
	);
}
