"use client";

import { XIcon } from "lucide-react";
import * as React from "react";
import { useSafeLegacyUiLocale } from "@hyper/sabraman/components/legacy-locale-context";
import { cn } from "@hyper/sabraman/lib/utils";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@hyper/sabraman/components/ui/dialog";

const LEGACY_ALERT_BUTTON_BACKGROUNDS = {
	default:
		"linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.04) 50.01%, rgba(255,255,255,0.08) 100%)",
	primary:
		"linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.36) 50.004%, rgba(255,255,255,0.24) 50.014%, rgba(255,255,255,0.36) 100%)",
} as const;

type LegacyAlertDialogButtonVariant =
	keyof typeof LEGACY_ALERT_BUTTON_BACKGROUNDS;

const LEGACY_SANS_STYLE = {
	fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

const CLOSE_COPY = {
	en: "Close dialog",
	ru: "Закрыть диалог",
} as const;

export type LegacyAlertDialogProps = React.ComponentProps<typeof Dialog>;

export interface LegacyAlertDialogContentProps
	extends React.ComponentProps<typeof DialogContent> {
	showCloseButton?: boolean;
}

export interface LegacyAlertDialogPanelProps
	extends React.HTMLAttributes<HTMLDivElement> {
	showCloseButton?: boolean;
}

export type LegacyAlertDialogHeaderProps = React.ComponentProps<"div">;
export type LegacyAlertDialogTitleProps = React.ComponentProps<
	typeof DialogTitle
>;
export type LegacyAlertDialogDescriptionProps = React.ComponentProps<
	typeof DialogDescription
>;
export type LegacyAlertDialogFooterProps = React.ComponentProps<"div">;

export interface LegacyAlertDialogButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: LegacyAlertDialogButtonVariant;
}

function LegacyAlertDialog(props: LegacyAlertDialogProps) {
	return <Dialog {...props} />;
}

const LegacyAlertDialogPanel = React.forwardRef<
	HTMLDivElement,
	LegacyAlertDialogPanelProps
>(({ children, className, showCloseButton = false, style, ...props }, ref) => {
	const locale = useSafeLegacyUiLocale();
	const closeLabel = CLOSE_COPY[locale];

	return (
		<div
			ref={ref}
			className={cn(
				"relative overflow-hidden rounded-[10px] border-[2px] border-[rgba(255,255,255,0.72)] bg-[rgba(8,26,80,0.82)] px-[8px] pt-[14px] pb-[9px] shadow-[0_0_0.5px_1px_rgba(0,0,0,0.4),0_4px_5px_rgba(0,0,0,0.5)]",
				className,
			)}
			style={{ ...LEGACY_SANS_STYLE, ...style }}
			{...props}
		>
			<div className="pointer-events-none absolute inset-x-[-2px] top-[-2px] h-[29px] bg-[radial-gradient(135%_88%_at_50%_-12%,rgba(249,251,255,0.95)_0%,rgba(196,205,226,0.64)_38%,rgba(94,110,149,0.28)_63%,rgba(8,26,80,0)_88%)]" />
			<div className="pointer-events-none absolute inset-x-[2px] top-[1px] h-px bg-white/26" />
			<div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.24)]" />

			{showCloseButton ? (
				<DialogClose asChild>
					<button
						aria-label={closeLabel}
						className="absolute top-3 right-3 z-[1] inline-flex size-8 items-center justify-center rounded-full text-white/86 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
						type="button"
					>
						<XIcon className="size-5" strokeWidth={2.15} />
					</button>
				</DialogClose>
			) : null}

			<div className="relative z-[1]">{children}</div>
		</div>
	);
});

LegacyAlertDialogPanel.displayName = "LegacyAlertDialogPanel";

function LegacyAlertDialogContent({
	children,
	className,
	showCloseButton = false,
	...props
}: LegacyAlertDialogContentProps) {
	return (
		<DialogContent
			className={cn(
				"w-[min(92vw,17.25rem)] max-w-none border-none bg-transparent p-0 shadow-none sm:max-w-none",
				className,
			)}
			showCloseButton={false}
			{...props}
		>
			<LegacyAlertDialogPanel showCloseButton={showCloseButton}>
				{children}
			</LegacyAlertDialogPanel>
		</DialogContent>
	);
}

function LegacyAlertDialogHeader({
	className,
	...props
}: LegacyAlertDialogHeaderProps) {
	return (
		<DialogHeader
			className={cn("gap-[8px] text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function LegacyAlertDialogTitle({
	className,
	...props
}: LegacyAlertDialogTitleProps) {
	return (
		<DialogTitle
			className={cn(
				"font-bold text-[18px] text-white leading-none [text-shadow:0px_-1px_0px_rgba(0,0,0,0.8)]",
				className,
			)}
			style={LEGACY_SANS_STYLE}
			{...props}
		/>
	);
}

function LegacyAlertDialogDescription({
	className,
	...props
}: LegacyAlertDialogDescriptionProps) {
	return (
		<DialogDescription
			className={cn(
				"text-[16px] text-white leading-[20px] [text-shadow:0px_-1px_0px_rgba(0,0,0,0.8)]",
				className,
			)}
			style={LEGACY_SANS_STYLE}
			{...props}
		/>
	);
}

function LegacyAlertDialogFooter({
	className,
	...props
}: LegacyAlertDialogFooterProps) {
	return (
		<DialogFooter
			className={cn("mt-[18px] flex-row gap-[10px]", className)}
			{...props}
		/>
	);
}

const LegacyAlertDialogButton = React.forwardRef<
	HTMLButtonElement,
	LegacyAlertDialogButtonProps
>(
	(
		{
			children,
			className,
			style,
			type = "button",
			variant = "default",
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				className={cn(
					"relative inline-flex min-h-[40px] min-w-[108px] items-center justify-center overflow-hidden rounded-[5px] border border-[rgba(0,0,0,0.4)] px-[8px] pt-[8px] pb-[10px] shadow-[0px_0.5px_0.5px_0px_rgba(255,255,255,0.2)] outline-none transition-transform duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
					className,
				)}
				style={{
					...LEGACY_SANS_STYLE,
					...style,
					backgroundImage: LEGACY_ALERT_BUTTON_BACKGROUNDS[variant],
				}}
				type={type}
				{...props}
			>
				<span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/16 to-transparent" />
				<span className="relative z-[1] font-bold text-[18px] text-white leading-[22px] [text-shadow:0px_-1px_0px_rgba(0,0,0,0.8)]">
					{children}
				</span>
			</button>
		);
	},
);

LegacyAlertDialogButton.displayName = "LegacyAlertDialogButton";

export {
	DialogClose as LegacyAlertDialogClose,
	LegacyAlertDialog,
	LegacyAlertDialogButton,
	LegacyAlertDialogContent,
	LegacyAlertDialogDescription,
	LegacyAlertDialogFooter,
	LegacyAlertDialogHeader,
	LegacyAlertDialogPanel,
	LegacyAlertDialogTitle,
	DialogTrigger as LegacyAlertDialogTrigger,
};
