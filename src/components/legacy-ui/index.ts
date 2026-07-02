export { cn } from "@/_internals/foundations/utils/cn"
export { useIsomorphicLayoutEffect } from "@/_internals/foundations/hooks/use-isomorphic-layout-effect"
export { buildRoundbitPaths, initRoundbit } from "@/components/effects/interactions/lib/roundbit"
export type { RoundbitController, RoundbitCornerValues, RoundbitPathOptions, RoundbitPathResult } from "@/components/effects/interactions/lib/roundbit"

export { RoundbitFrame } from "@/components/effects/interactions/roundbit"
export type { RoundbitFrameProps } from "@/components/effects/interactions/roundbit"

export { LegacyBarButton } from "@/components/navigation/legacy-bar-button"
export type { LegacyBarButtonProps } from "@/components/navigation/legacy-bar-button"

export { LegacySegmentedControl } from "@/components/data-entry/segmented-control-pill"
export type { LegacySegmentedControlItem, LegacySegmentedControlProps } from "@/components/data-entry/segmented-control-pill"

export { LegacySwitch } from "@/components/data-entry/switch-rounded"
export type { LegacySwitchProps } from "@/components/data-entry/switch-rounded"

export { LegacySlider } from "@/components/data-entry/slider-rounded"
export type { LegacySliderProps } from "@/components/data-entry/slider-rounded"

export { LegacyClock } from "@/components/data-display/clock-flip"
export type { LegacyClockProps, LegacyClockVariant } from "@/components/data-display/clock-flip"

export { LegacyNotification, showLegacyNotification } from "@/components/feedback/legacy-notification"
export type { LegacyNotificationProps, ShowLegacyNotificationOptions } from "@/components/feedback/legacy-notification"

export {
	LegacyAlertDialog,
	LegacyAlertDialogButton,
	LegacyAlertDialogContent,
	LegacyAlertDialogDescription,
	LegacyAlertDialogFooter,
	LegacyAlertDialogHeader,
	LegacyAlertDialogPanel,
	LegacyAlertDialogTitle,
	LegacyAlertDialogClose,
	LegacyAlertDialogTrigger,
} from "@/components/feedback/legacy-alert-dialog"
export type {
	LegacyAlertDialogProps,
	LegacyAlertDialogContentProps,
	LegacyAlertDialogPanelProps,
	LegacyAlertDialogHeaderProps,
	LegacyAlertDialogTitleProps,
	LegacyAlertDialogDescriptionProps,
	LegacyAlertDialogFooterProps,
	LegacyAlertDialogButtonProps,
} from "@/components/feedback/legacy-alert-dialog"

export {
	LegacyCodeBlockCommand,
	convertNpmCommand,
	PackageManagerIcon,
	usePreferredPackageManager,
} from "@/components/general/legacy-code-block-command"
export type {
	LegacyCodeBlockCommandProps,
	PackageManager,
	ConvertNpmCommandResult,
} from "@/components/general/legacy-code-block-command"

export {
	LegacyUiLocaleProvider,
	useLegacyUiLocale,
	useSafeLegacyUiLocale,
} from "@/components/general/legacy-locale-context"
export type { SupportedLocale } from "@/components/general/legacy-locale-context"
