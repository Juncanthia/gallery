"use client";

import * as React from "react";

import { cn } from "@hyper/sabraman/lib/utils";

type LegacyBarButtonVariant = "default" | "accent" | "destructive";
type LegacyBarButtonLayout = "text" | "icon" | "text-icon" | "backward";

const BAR_BUTTON_GRADIENT_STOPS: Record<LegacyBarButtonVariant, string[]> = {
	accent: ["#93B5F6", "#6790E1", "#3C71DA", "#2562D9"],
	default: ["#A2B2C9", "#798EAC", "#506D94", "#405F8A"],
	destructive: ["#DB8B92", "#C3626A", "#B2303B", "#B01A27"],
};

function getBarButtonBackground(variant: LegacyBarButtonVariant) {
	const [start, second, third, end] = BAR_BUTTON_GRADIENT_STOPS[variant];

	return `linear-gradient(180deg, ${start} 0%, ${second} 33%, ${third} 67%, ${end} 100%)`;
}

export interface LegacyBarButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: React.ReactNode;
	label?: string;
	layout?: LegacyBarButtonLayout;
	trailingIcon?: React.ReactNode;
	variant?: LegacyBarButtonVariant;
}

const LegacyBarButton = React.forwardRef<
	HTMLButtonElement,
	LegacyBarButtonProps
>(
	(
		{
			className,
			icon,
			label,
			layout,
			style,
			trailingIcon,
			type = "button",
			variant = "default",
			...props
		},
		ref,
	) => {
		const backgroundImage = getBarButtonBackground(variant);
		const svgId = React.useId().replace(/:/g, "");
		const resolvedLayout =
			layout ??
			(icon || trailingIcon ? (label ? "text-icon" : "icon") : "text");
		const labelNode = label ? (
			<div className="relative z-[1] flex min-w-[32px] shrink-0 flex-col justify-center whitespace-nowrap text-center font-bold text-[12px] text-white leading-[0] [text-shadow:0px_-1px_0px_rgba(0,0,0,0.4)]">
				<p className="leading-[normal]">{label}</p>
			</div>
		) : null;

		if (resolvedLayout === "backward") {
			const [start, second, third, end] = BAR_BUTTON_GRADIENT_STOPS[variant];
			const innerPath =
				"M15 0.5 H94.5 Q99.5 0.5 99.5 5.5 V23.5 Q99.5 28.5 94.5 28.5 H15 Q11.2 28.5 8.4 25.3 L1.4 16.9 Q0.5 15.8 0.5 14.5 Q0.5 13.2 1.4 12.1 L8.4 3.7 Q11.2 0.5 15 0.5 Z";

			return (
				<button
					ref={ref}
					className={cn(
						"relative inline-flex h-[29px] min-w-[56px] items-center justify-start pr-[9px] pl-[16px] outline-none transition-transform duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					style={{
						...style,
						fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
					}}
					type={type}
					{...props}
				>
					<svg
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
						preserveAspectRatio="none"
						viewBox="0 0 100 29"
					>
						<defs>
							<linearGradient
								id={`${svgId}-fill`}
								gradientUnits="userSpaceOnUse"
								x1="0"
								x2="0"
								y1="0"
								y2="29"
							>
								<stop offset="0%" stopColor={start} />
								<stop offset="33%" stopColor={second} />
								<stop offset="67%" stopColor={third} />
								<stop offset="100%" stopColor={end} />
							</linearGradient>
							<filter
								id={`${svgId}-shadow`}
								colorInterpolationFilters="sRGB"
								height="160%"
								width="140%"
								x="-18%"
								y="-20%"
							>
								<feDropShadow
									dx="0"
									dy="1"
									floodColor="rgba(0,0,0,0.28)"
									stdDeviation="0.9"
								/>
							</filter>
						</defs>

						<g filter={`url(#${svgId}-shadow)`}>
							<path d={innerPath} fill={`url(#${svgId}-fill)`} />
							<path
								d={innerPath}
								fill="none"
								stroke="rgba(0,0,0,0.62)"
								strokeWidth="1"
							/>
							<path
								d={innerPath}
								fill="none"
								stroke="rgba(255,255,255,0.1)"
								strokeWidth="0.7"
								transform="translate(0,-0.35)"
							/>
						</g>
					</svg>
					<span className="relative z-[1] flex h-full items-center justify-start">
						{labelNode}
					</span>
				</button>
			);
		}

		return (
			<button
				ref={ref}
				className={cn(
					"relative inline-flex h-[29px] items-center justify-center overflow-hidden rounded-[5px] shadow-[0px_0.5px_0.5px_0px_rgba(255,255,255,0.4)] outline-none transition-transform duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
					resolvedLayout === "text" && "min-w-[52px] px-[10px]",
					resolvedLayout === "icon" && "min-w-[33px] px-[6px]",
					resolvedLayout === "text-icon" &&
						"min-w-[50px] gap-[5px] pr-[15px] pl-[10px]",
					className,
				)}
				style={{
					...style,
					backgroundImage,
					fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
				}}
				type={type}
				{...props}
			>
				{icon ? (
					<span className="relative z-[1] flex shrink-0 items-center justify-center text-white [filter:drop-shadow(0px_-1px_0px_rgba(0,0,0,0.4))] [&_svg]:size-[15px]">
						{icon}
					</span>
				) : null}
				{labelNode}
				{trailingIcon ? (
					<span className="relative z-[1] flex shrink-0 items-center justify-center text-white [filter:drop-shadow(0px_-1px_0px_rgba(0,0,0,0.4))] [&_svg]:size-[12px]">
						{trailingIcon}
					</span>
				) : null}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_1px_0px_black,inset_0px_1px_0.5px_0px_rgba(0,0,0,0.4)]"
				/>
			</button>
		);
	},
);

LegacyBarButton.displayName = "LegacyBarButton";

export { LegacyBarButton };
