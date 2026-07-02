"use client";

import * as React from "react";
import { type ExternalToast, toast } from "sonner";

import { cn } from "@/_internals/foundations/utils/cn";

const LEGACY_NOTIFICATION_FONT_FAMILY =
	'"Helvetica Neue", Helvetica, Arial, sans-serif';

export interface LegacyNotificationProps
	extends React.HTMLAttributes<HTMLDivElement> {
	body?: string;
	icon?: React.ReactNode;
	showIcon?: boolean;
	showBody?: boolean;
	showSubtitle?: boolean;
	subtitle?: string;
	time?: string;
	title?: string;
}

export interface ShowLegacyNotificationOptions
	extends Omit<LegacyNotificationProps, "className" | "style"> {
	toastOptions?: ExternalToast;
}

const LegacyNotification = React.forwardRef<
	HTMLDivElement,
	LegacyNotificationProps
>(
	(
		{
			body = "Body",
			className,
			icon,
			showIcon = true,
			showBody = true,
			showSubtitle = true,
			style,
			subtitle = "Subtitle",
			time = "now",
			title = "Title",
			...props
		},
		ref,
	) => {
		return (
			<div
				{...props}
				ref={ref}
				className={cn(
					"relative isolate flex min-h-[70px] w-[320px] items-start overflow-hidden rounded-[8px] border border-black/60 bg-black/80 px-[8px] py-[12px] text-white shadow-[0px_5px_5px_0px_rgba(0,0,0,0.5)]",
					showIcon ? "gap-[6px]" : "gap-0",
					className,
				)}
				style={{
					...style,
					fontFamily: LEGACY_NOTIFICATION_FONT_FAMILY,
				}}
			>
				{showIcon ? <LegacyNotificationIcon icon={icon} /> : null}

				<div className="relative z-[2] flex min-h-px min-w-0 flex-1 flex-col gap-[4px] overflow-hidden text-white [text-shadow:0px_-1px_0px_rgba(0,0,0,0.8)]">
					<div className="flex w-full items-baseline gap-[4px] whitespace-nowrap font-bold text-[18px] leading-[18px]">
						<p className="min-h-px min-w-0 flex-1 overflow-hidden text-ellipsis">
							{title}
						</p>
						<p className="shrink-0 overflow-hidden text-[16px] leading-[16px]">
							{time}
						</p>
					</div>

					{showSubtitle ? (
						<p className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold text-[16px] leading-[16px]">
							{subtitle}
						</p>
					) : null}

					{showBody ? (
						<p className="w-full overflow-hidden font-normal text-[16px] leading-[16px]">
							{body}
						</p>
					) : null}
				</div>

				<div className="pointer-events-none absolute inset-x-[-1px] top-0 z-[1] h-[24px] rounded-t-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.1)_100%)]" />

				<div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.18)]" />
			</div>
		);
	},
);
LegacyNotification.displayName = "LegacyNotification";

function LegacyNotificationIcon({ icon }: { icon?: React.ReactNode }) {
	return (
		<div className="relative z-[3] flex size-[29px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-[linear-gradient(180deg,#fcfcfc_0%,#dadada_100%)] text-[#121212] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_0.5px_0_rgba(0,0,0,0.35)]">
			{icon ? (
				<div className="relative z-[1] [&_svg]:size-[17px]">{icon}</div>
			) : null}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[13px] bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.18)_100%)]" />
			<div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.65),inset_0_-0.5px_0_rgba(0,0,0,0.12)]" />
		</div>
	);
}

export function showLegacyNotification({
	toastOptions,
	...props
}: ShowLegacyNotificationOptions) {
	return toast.custom(() => <LegacyNotification {...props} />, {
		duration: 4200,
		position: "top-center",
		unstyled: true,
		...toastOptions,
	});
}

export { LegacyNotification };
