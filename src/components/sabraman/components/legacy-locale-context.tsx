"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export type SupportedLocale = "en" | "ru";

const LegacyUiLocaleContext = createContext<SupportedLocale | null>(null);

export function LegacyUiLocaleProvider({
	children,
	locale,
}: {
	children: ReactNode;
	locale: SupportedLocale;
}) {
	return (
		<LegacyUiLocaleContext.Provider value={locale}>
			{children}
		</LegacyUiLocaleContext.Provider>
	);
}

export function useLegacyUiLocale() {
	const locale = useContext(LegacyUiLocaleContext);

	if (!locale) {
		throw new Error("Legacy UI locale context is missing.");
	}

	return locale;
}

export function useSafeLegacyUiLocale(): SupportedLocale {
	const locale = useContext(LegacyUiLocaleContext);
	return locale ?? "en";
}
