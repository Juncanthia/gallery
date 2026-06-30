"use client";

import * as React from "react";

import { cn } from "@hyper/sabraman/lib/utils";

const CLOCK_FRAME_SIZE = 76;
const FALLBACK_CLOCK_TIME = {
	hours: 10,
	minutes: 9,
	seconds: 30,
} as const;
const DEFAULT_CLOCK_ASSET_BASE_URL = "/figma/legacy-clock";
const INNER_CLOCK_SHADOW = "0px -0.5px 0.5px 0px rgba(0,0,0,0.5)";
const INNER_CLOCK_HIGHLIGHT =
	"inset 0px -0.1px 0.5px 0px rgba(255,255,255,0.8)";

export type LegacyClockVariant = "day" | "night";

const CLOCK_VARIANTS = {
	day: {
		background: "linear-gradient(180deg, #d5d5d5 0%, #e7e7e7 100%)",
		centerCapSrc: "day-center-cap.svg",
		charactersSrc: "day-characters.svg",
		glossSrc: "day-gloss.svg",
		hourHandInset: -7.18,
		hourHandSrc: "day-hour-hand.svg",
		minuteHandInset: -7.18,
		minuteHandSrc: "day-minute-hand.svg",
		secondHandInset: -8.44,
	},
	night: {
		background: "#000000",
		centerCapSrc: "night-center-cap.svg",
		charactersSrc: "night-characters.svg",
		glossSrc: "night-gloss.svg",
		hourHandInset: -7.46,
		hourHandSrc: "night-hour-hand.svg",
		minuteHandInset: -7.18,
		minuteHandSrc: "night-minute-hand.svg",
		secondHandInset: {
			bottom: -8.44,
			left: -8.45,
			right: -8.44,
			top: -8.44,
		},
	},
} as const;

export interface LegacyClockProps extends React.HTMLAttributes<HTMLDivElement> {
	date?: Date;
	live?: boolean;
	showSeconds?: boolean;
	size?: number;
	variant?: LegacyClockVariant;
	withShadow?: boolean;
}

const LegacyClock = React.forwardRef<HTMLDivElement, LegacyClockProps>(
	(
		{
			className,
			date,
			live = true,
			showSeconds = true,
			size = CLOCK_FRAME_SIZE,
			style,
			variant = "day",
			withShadow = true,
			...props
		},
		ref,
	) => {
		const [now, setNow] = React.useState<Date | null>(null);

		React.useEffect(() => {
			if (date || !live) {
				return;
			}

			let timeoutId = 0;

			const scheduleTick = () => {
				setNow(new Date());
				timeoutId = window.setTimeout(
					scheduleTick,
					1000 - (Date.now() % 1000) + 12,
				);
			};

			scheduleTick();

			return () => {
				window.clearTimeout(timeoutId);
			};
		}, [date, live]);

		const resolvedDate = date ?? now;
		const time = resolvedDate
			? {
					hours: resolvedDate.getHours() % 12,
					minutes: resolvedDate.getMinutes(),
					seconds:
						resolvedDate.getSeconds() + resolvedDate.getMilliseconds() / 1000,
				}
			: FALLBACK_CLOCK_TIME;
		const hourAngle = roundClockValue(
			time.hours * 30 + time.minutes * 0.5 + time.seconds / 120,
		);
		const minuteAngle = roundClockValue(time.minutes * 6 + time.seconds * 0.1);
		const secondAngle = roundClockValue(time.seconds * 6);
		const scale = size / CLOCK_FRAME_SIZE;
		const variantTheme = CLOCK_VARIANTS[variant];

		return (
			<div
				className={cn("relative inline-block shrink-0 align-middle", className)}
				ref={ref}
				style={{
					...style,
					filter: withShadow
						? `drop-shadow(0px ${roundClockValue(size * 0.12)}px ${roundClockValue(size * 0.24)}px rgba(0,0,0,0.26))`
						: undefined,
					height: size,
					width: size,
				}}
				{...props}
			>
				<div
					className="absolute top-0 left-0 origin-top-left overflow-hidden rounded-[40px]"
					style={{
						background: variantTheme.background,
						boxShadow: INNER_CLOCK_SHADOW,
						height: CLOCK_FRAME_SIZE,
						transform: `scale(${scale})`,
						transformOrigin: "top left",
						width: CLOCK_FRAME_SIZE,
					}}
				>
					<ClockSprite
						src={buildClockAssetUrl(DEFAULT_CLOCK_ASSET_BASE_URL, variantTheme.glossSrc)}
						style={{
							height: 34.722,
							left: 0,
							top: 0,
							width: CLOCK_FRAME_SIZE,
						}}
					/>
					<ClockSprite
						src={buildClockAssetUrl(DEFAULT_CLOCK_ASSET_BASE_URL, variantTheme.charactersSrc)}
						style={{
							height: 64.073,
							left: 7.07,
							top: 5.53,
							width: 63.834,
						}}
					/>
					<ClockHandLayer
						centerCapSrc={buildClockAssetUrl(
							DEFAULT_CLOCK_ASSET_BASE_URL,
							variantTheme.centerCapSrc,
						)}
						handInset={variantTheme.hourHandInset}
						handLength={14}
						handSrc={buildClockAssetUrl(DEFAULT_CLOCK_ASSET_BASE_URL, variantTheme.hourHandSrc)}
						handTop={17}
						rotation={hourAngle}
					/>
					<ClockHandLayer
						centerCapSrc={buildClockAssetUrl(
							DEFAULT_CLOCK_ASSET_BASE_URL,
							variantTheme.centerCapSrc,
						)}
						handInset={variantTheme.minuteHandInset}
						handLength={25}
						handSrc={buildClockAssetUrl(
							DEFAULT_CLOCK_ASSET_BASE_URL,
							variantTheme.minuteHandSrc,
						)}
						handTop={6}
						rotation={minuteAngle}
					/>
					{showSeconds ? (
						<ClockSecondHandLayer
							handInset={variantTheme.secondHandInset}
							rotation={secondAngle}
							secondsCapSrc={buildClockAssetUrl(
								DEFAULT_CLOCK_ASSET_BASE_URL,
								"seconds-cap.svg",
							)}
						/>
					) : null}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 rounded-[inherit]"
						style={{
							boxShadow: INNER_CLOCK_HIGHLIGHT,
						}}
					/>
				</div>
			</div>
		);
	},
);

interface ClockHandLayerProps {
	centerCapSrc: string;
	handInset: number;
	handLength: number;
	handSrc: string;
	handTop: number;
	rotation: number;
}

function ClockHandLayer({
	centerCapSrc,
	handInset,
	handLength,
	handSrc,
	handTop,
	rotation,
}: ClockHandLayerProps) {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute flex items-center justify-center"
			style={{
				inset: handInset,
			}}
		>
			<div
				className="relative shrink-0"
				style={{
					height: 68,
					transform: `rotate(${rotation}deg)`,
					transformOrigin: "50% 50%",
					width: 68,
				}}
			>
				<ClockSprite
					src={centerCapSrc}
					style={{
						height: 8,
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						width: 8,
					}}
				/>
				<ClockSprite
					src={handSrc}
					style={{
						height: handLength,
						left: 31.5,
						top: handTop,
						width: 5,
					}}
				/>
			</div>
		</div>
	);
}

interface ClockSecondHandLayerProps {
	handInset: number | React.CSSProperties;
	rotation: number;
	secondsCapSrc: string;
}

function ClockSecondHandLayer({
	handInset,
	rotation,
	secondsCapSrc,
}: ClockSecondHandLayerProps) {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute flex items-center justify-center"
			style={resolveInsetStyle(handInset)}
		>
			<div
				className="relative shrink-0"
				style={{
					height: 68,
					transform: `rotate(${rotation}deg)`,
					transformOrigin: "50% 50%",
					width: 68,
				}}
			>
				<ClockSprite
					src={secondsCapSrc}
					style={{
						height: 6,
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						width: 3,
					}}
				/>
				<div
					className="absolute rounded-[1px]"
					style={{
						background: "#da0812",
						height: 32,
						left: 33.5,
						top: 0,
						width: 1,
					}}
				/>
			</div>
		</div>
	);
}

interface ClockSpriteProps {
	src: string;
	style: React.CSSProperties;
}

function ClockSprite({ src, style }: ClockSpriteProps) {
	return (
		<img
			alt=""
			aria-hidden="true"
			className="pointer-events-none absolute block max-w-none select-none"
			draggable="false"
			src={src}
			style={style}
		/>
	);
}

function buildClockAssetUrl(baseUrl: string, assetName: string) {
	return `${baseUrl.replace(/\/$/, "")}/${assetName}`;
}

function resolveInsetStyle(value: number | React.CSSProperties) {
	return typeof value === "number" ? { inset: value } : value;
}

function roundClockValue(value: number) {
	return Math.round(value * 100) / 100;
}

LegacyClock.displayName = "LegacyClock";

export { LegacyClock };
