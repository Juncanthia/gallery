"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/components/_shared/sabraman/lib/utils";

export interface LegacySwitchProps
	extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
	offLabel?: string;
	onLabel?: string;
}

const LegacySwitch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitive.Root>,
	LegacySwitchProps
>(({ className, offLabel = "OFF", onLabel = "ON", style, ...props }, ref) => {
	return (
		<SwitchPrimitive.Root
			ref={ref}
			data-slot="legacy-switch"
			className={cn(
				"group peer relative inline-flex h-[27px] w-[77px] shrink-0 overflow-hidden rounded-[20px] border-[0.5px] border-transparent outline-none transition-[background-color,border-color,box-shadow] duration-200 ease-out focus-visible:ring-[#007fea]/35 focus-visible:ring-[3px] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:border-[#7d7d7d] data-[state=checked]:bg-[#007fea] data-[state=unchecked]:bg-[#eeeeee]",
				className,
			)}
			style={{
				...style,
				fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
			}}
			{...props}
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute left-[27.5px] top-[13.5px] flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center whitespace-nowrap text-center opacity-0 transition-opacity duration-200 [text-shadow:0px_-1px_0px_rgba(0,0,0,0.25)] group-data-[state=checked]:opacity-100"
			>
				<span className="font-bold text-[16px] text-white leading-[18px]">
					{onLabel}
				</span>
			</span>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute left-[49.5px] top-[13px] flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center whitespace-nowrap text-center transition-opacity duration-200 group-data-[state=checked]:opacity-0"
			>
				<span className="font-bold text-[16px] text-[#7b7b7b] leading-[18px]">
					{offLabel}
				</span>
			</span>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-[4.5px] bottom-[-2.5px] left-[4.5px] h-[16px] rounded-[8px] transition-all duration-200 group-data-[state=unchecked]:bg-white group-data-[state=unchecked]:opacity-40 group-data-[state=checked]:right-[5px] group-data-[state=checked]:bottom-[-2px] group-data-[state=checked]:left-[5px] group-data-[state=checked]:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.5)_100%)] group-data-[state=checked]:opacity-100"
			/>
			<SwitchPrimitive.Thumb
				data-slot="legacy-switch-thumb"
				className="pointer-events-none absolute top-1/2 left-0 block size-[26px] -translate-y-1/2 rounded-[13px] border-[#616161] border-[0.5px] bg-[linear-gradient(180deg,#d0d0d0_0%,#fcfcfc_100%)] shadow-[0px_0px_1px_1px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out data-[state=checked]:translate-x-[50.5px] data-[state=unchecked]:translate-x-0"
			>
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1.5px_0px_0px_rgba(255,255,255,0.6),inset_0px_0px_0px_1px_rgba(255,255,255,0.6)]"
				/>
			</SwitchPrimitive.Thumb>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_3px_0px_rgba(0,0,0,0.6)]"
			/>
		</SwitchPrimitive.Root>
	);
});
LegacySwitch.displayName = "LegacySwitch";

export { LegacySwitch };
