"use client";

import * as React from "react";
import { useIsomorphicLayoutEffect } from "@/_internals/foundations/hooks/use-isomorphic-layout-effect";
import { initRoundbit } from "@/components/effects/interactions/lib/roundbit";
import { cn } from "@/_internals/foundations/utils/cn";

export interface RoundbitFrameProps
	extends React.HTMLAttributes<HTMLDivElement> {
	contentClassName?: string;
	contentProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const RoundbitFrame = React.forwardRef<
	HTMLDivElement,
	RoundbitFrameProps
>(({ children, className, contentClassName, contentProps, ...props }, ref) => {
	const frameRef = React.useRef<HTMLDivElement | null>(null);

	useIsomorphicLayoutEffect(() => {
		if (!frameRef.current) {
			return;
		}

		try {
			return initRoundbit(frameRef.current).disconnect;
		} catch (error) {
			console.error("Failed to initialize roundbit frame.", error);
		}
	}, []);

	return (
		<div
			{...props}
			className={cn("roundbit-frame", className)}
			ref={(node) => {
				frameRef.current = node;

				if (typeof ref === "function") {
					ref(node);
					return;
				}

				if (ref) {
					ref.current = node;
				}
			}}
		>
			<div
				{...contentProps}
				className={cn("roundbit-content", contentClassName)}
			>
				{children}
			</div>
		</div>
	);
});

RoundbitFrame.displayName = "RoundbitFrame";
