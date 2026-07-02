type RoundbitPoint = {
	x: number;
	y: number;
};

type RoundbitInsetSides = {
	top: number;
	right: number;
	bottom: number;
	left: number;
};

type RoundbitColorSides = {
	top: string;
	right: string;
	bottom: string;
	left: string;
};

type RoundbitBorderStyle =
	| "solid"
	| "dashed"
	| "dotted"
	| "double"
	| "none"
	| "hidden";

type RoundbitBorderRenderer = "none" | "band" | "svg";

type RoundbitBorderConfig = {
	source: "dedicated" | "native" | "none";
	style: RoundbitBorderStyle;
	widths: RoundbitInsetSides;
	colors: RoundbitColorSides;
	hasVisibleBorder: boolean;
	uniformColor: string | null;
	uniformWidth: number | null;
};

type RoundbitFrameEffects = {
	border: RoundbitBorderConfig;
	proxyOutline: boolean;
	proxyOutlineColor: string;
	proxyOutlineWidth: number;
	proxyShadow: boolean;
	proxyShadowFilter: string | null;
	renderer: RoundbitBorderRenderer;
};

export type RoundbitCornerValues = {
	bottomLeft: number;
	bottomRight: number;
	topLeft: number;
	topRight: number;
};

export interface RoundbitPathOptions {
	corners: RoundbitCornerValues;
	height: number;
	inset?: number;
	step?: number;
	width: number;
}

export interface RoundbitPathResult {
	clipPath: string;
	corners: RoundbitCornerValues;
	height: number;
	inset: number;
	step: number;
	width: number;
}

export interface RoundbitController {
	disconnect: () => void;
	refresh: () => void;
}

const DEFAULT_ROUNDBIT_STEP = 2;
const ROUND_BIT_SELECTOR = "[class*='roundbit']";
const ROUND_BIT_CLASS_PATTERN = /(^|\s)roundbit(?:$|\b|-)/;
const rootControllers = new WeakMap<Node, RoundbitController>();

export function buildRoundbitPaths({
	corners,
	height,
	inset = 0,
	step = DEFAULT_ROUNDBIT_STEP,
	width,
}: RoundbitPathOptions): RoundbitPathResult {
	const normalizedInset = Math.max(0, inset);
	const normalizedStep = normalizeStep(step);
	const innerWidth = Math.max(0, width - normalizedInset * 2);
	const innerHeight = Math.max(0, height - normalizedInset * 2);
	const insetCorners = clampRoundbitCorners(
		{
			bottomLeft: Math.max(0, corners.bottomLeft - normalizedInset),
			bottomRight: Math.max(0, corners.bottomRight - normalizedInset),
			topLeft: Math.max(0, corners.topLeft - normalizedInset),
			topRight: Math.max(0, corners.topRight - normalizedInset),
		},
		innerWidth,
		innerHeight,
	);
	const polygonPoints = buildPolygonPoints(
		innerWidth,
		innerHeight,
		insetCorners,
		normalizedStep,
	);

	return {
		clipPath: buildPolygonValue(polygonPoints),
		corners: insetCorners,
		height: innerHeight,
		inset: normalizedInset,
		step: normalizedStep,
		width: innerWidth,
	};
}

export function initRoundbit(root: ParentNode | Document | Element = document) {
	if (typeof window === "undefined") {
		return {
			disconnect() {},
			refresh() {},
		} satisfies RoundbitController;
	}

	const rootNode = resolveRootNode(root);
	const existing = rootControllers.get(rootNode);

	if (existing) {
		existing.refresh();
		return existing;
	}

	const tracked = new Set<HTMLElement>();
	const resizeObserver =
		typeof ResizeObserver === "undefined"
			? null
			: new ResizeObserver((entries) => {
					for (const entry of entries) {
						if (entry.target instanceof HTMLElement) {
							refreshRoundbitElement(entry.target);
						}
					}
				});
	const mutationObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) {
					rescanNode(node);
				}

				for (const node of mutation.removedNodes) {
					untrackNode(node);
				}

				continue;
			}

			if (!(mutation.target instanceof HTMLElement)) {
				continue;
			}

			if (
				mutation.attributeName === "style" &&
				isManagedRoundbitStyleMutation(mutation.target)
			) {
				continue;
			}

			if (mutation.attributeName === "dir") {
				rescanNode(mutation.target);
				continue;
			}

			rescanNode(mutation.target);
		}
	});

	function trackElement(element: HTMLElement) {
		if (!tracked.has(element)) {
			tracked.add(element);
			resizeObserver?.observe(element);
		}

		refreshRoundbitElement(element);
	}

	function untrackElement(element: HTMLElement) {
		if (!tracked.delete(element)) {
			return;
		}

		resizeObserver?.unobserve(element);
		clearRoundbitState(element);
	}

	function rescanNode(node: Node) {
		if (node instanceof HTMLElement) {
			if (shouldTrackRoundbitElement(node)) {
				trackElement(node);
			} else {
				untrackElement(node);
			}
		}

		if (isQueryableNode(node)) {
			for (const element of node.querySelectorAll<HTMLElement>(
				ROUND_BIT_SELECTOR,
			)) {
				if (shouldTrackRoundbitElement(element)) {
					trackElement(element);
					continue;
				}

				untrackElement(element);
			}
		}
	}

	function untrackNode(node: Node) {
		if (node instanceof HTMLElement) {
			untrackElement(node);
		}

		if (isQueryableNode(node)) {
			for (const element of node.querySelectorAll<HTMLElement>(
				ROUND_BIT_SELECTOR,
			)) {
				untrackElement(element);
			}
		}
	}

	function refresh() {
		for (const element of [...tracked]) {
			if (!element.isConnected || !shouldTrackRoundbitElement(element)) {
				untrackElement(element);
				continue;
			}

			refreshRoundbitElement(element);
		}

		rescanNode(rootNode);
	}

	rescanNode(rootNode);

	const windowTarget =
		rootNode.ownerDocument?.defaultView ??
		(rootNode instanceof Document ? rootNode.defaultView : window);
	const handleWindowResize = () => {
		refresh();
	};

	windowTarget?.addEventListener("resize", handleWindowResize);
	mutationObserver.observe(rootNode, {
		attributeFilter: ["class", "dir", "style"],
		attributes: true,
		childList: true,
		subtree: true,
	});

	const controller = {
		disconnect() {
			mutationObserver.disconnect();
			resizeObserver?.disconnect();
			windowTarget?.removeEventListener("resize", handleWindowResize);

			for (const element of tracked) {
				clearRoundbitState(element);
			}

			tracked.clear();
			rootControllers.delete(rootNode);
		},
		refresh,
	} satisfies RoundbitController;

	rootControllers.set(rootNode, controller);
	return controller;
}

function buildPolygonPoints(
	width: number,
	height: number,
	corners: RoundbitCornerValues,
	step: number,
) {
	return stitchCornerGroups([
		buildTopLeftCorner(corners.topLeft, step),
		buildTopRightCorner(width, corners.topRight, step),
		buildBottomRightCorner(width, height, corners.bottomRight, step),
		buildBottomLeftCorner(height, corners.bottomLeft, step),
	]);
}

function buildUniformInsetSides(value: number): RoundbitInsetSides {
	return {
		bottom: value,
		left: value,
		right: value,
		top: value,
	};
}

function normalizeInsetSides(insets: RoundbitInsetSides): RoundbitInsetSides {
	return {
		bottom: Math.max(0, formatCssNumber(insets.bottom)),
		left: Math.max(0, formatCssNumber(insets.left)),
		right: Math.max(0, formatCssNumber(insets.right)),
		top: Math.max(0, formatCssNumber(insets.top)),
	};
}

function quantizeInsetSides(
	insets: RoundbitInsetSides,
	step: number,
): RoundbitInsetSides {
	return {
		bottom: quantizeInsetToStep(insets.bottom, step),
		left: quantizeInsetToStep(insets.left, step),
		right: quantizeInsetToStep(insets.right, step),
		top: quantizeInsetToStep(insets.top, step),
	};
}

function addInsetSides(
	first: RoundbitInsetSides,
	second: RoundbitInsetSides,
): RoundbitInsetSides {
	return {
		bottom: formatCssNumber(first.bottom + second.bottom),
		left: formatCssNumber(first.left + second.left),
		right: formatCssNumber(first.right + second.right),
		top: formatCssNumber(first.top + second.top),
	};
}

function scaleInsetSides(
	insets: RoundbitInsetSides,
	multiplier: number,
): RoundbitInsetSides {
	return {
		bottom: formatCssNumber(insets.bottom * multiplier),
		left: formatCssNumber(insets.left * multiplier),
		right: formatCssNumber(insets.right * multiplier),
		top: formatCssNumber(insets.top * multiplier),
	};
}

function maxInsetSide(insets: RoundbitInsetSides) {
	return Math.max(insets.top, insets.right, insets.bottom, insets.left, 0);
}

function areAllInsetsZero(insets: RoundbitInsetSides) {
	return maxInsetSide(insets) <= 0;
}

function buildPolygonValue(points: RoundbitPoint[]) {
	const safePoints =
		points.length === 0
			? [
					{ x: 0, y: 0 },
					{ x: 1, y: 0 },
					{ x: 1, y: 1 },
					{ x: 0, y: 1 },
				]
			: points;

	return `polygon(${safePoints.map(pointToCssValue).join(", ")})`;
}

function buildBandPolygonValue(
	outerPoints: RoundbitPoint[],
	innerPoints: RoundbitPoint[],
	outerInset: number,
	innerInset: number,
) {
	if (innerPoints.length === 0 || innerInset <= outerInset) {
		return buildPolygonValue(outerPoints);
	}

	return `polygon(${outerPoints.map(pointToCssValue).join(", ")}, ${formatCssNumber(
		outerInset,
	)}px 50%, ${formatCssNumber(innerInset)}px 50%, ${[...innerPoints]
		.reverse()
		.map(pointToCssValue)
		.join(", ")}, ${formatCssNumber(innerInset)}px 50%, ${formatCssNumber(
		outerInset,
	)}px 50%)`;
}

type RoundbitOffsetSegment =
	| {
			orientation: "horizontal";
			side: keyof RoundbitInsetSides;
			x1: number;
			x2: number;
			y: number;
	  }
	| {
			orientation: "vertical";
			side: keyof RoundbitInsetSides;
			x: number;
			y1: number;
			y2: number;
	  };

function buildOffsetSegments(
	points: RoundbitPoint[],
	insets: RoundbitInsetSides,
): RoundbitOffsetSegment[] {
	return points.map((point, index) => {
		const nextPoint = points[(index + 1) % points.length] ?? point;

		if (point.y === nextPoint.y) {
			if (nextPoint.x >= point.x) {
				return {
					orientation: "horizontal",
					side: "top",
					x1: point.x,
					x2: nextPoint.x,
					y: formatCssNumber(point.y + insets.top),
				} satisfies RoundbitOffsetSegment;
			}

			return {
				orientation: "horizontal",
				side: "bottom",
				x1: point.x,
				x2: nextPoint.x,
				y: formatCssNumber(point.y - insets.bottom),
			} satisfies RoundbitOffsetSegment;
		}

		if (nextPoint.y >= point.y) {
			return {
				orientation: "vertical",
				side: "right",
				x: formatCssNumber(point.x - insets.right),
				y1: point.y,
				y2: nextPoint.y,
			} satisfies RoundbitOffsetSegment;
		}

		return {
			orientation: "vertical",
			side: "left",
			x: formatCssNumber(point.x + insets.left),
			y1: point.y,
			y2: nextPoint.y,
		} satisfies RoundbitOffsetSegment;
	});
}

function intersectOffsetSegments(
	current: RoundbitOffsetSegment | undefined,
	next: RoundbitOffsetSegment | undefined,
) {
	if (!current || !next || current.orientation === next.orientation) {
		return null;
	}

	if (current.orientation === "horizontal") {
		if (next.orientation !== "vertical") {
			return null;
		}

		return {
			x: next.x,
			y: current.y,
		} satisfies RoundbitPoint;
	}

	if (next.orientation !== "horizontal") {
		return null;
	}

	return {
		x: current.x,
		y: next.y,
	} satisfies RoundbitPoint;
}

function buildFallbackInsetPolygon(
	insets: RoundbitInsetSides,
	width: number,
	height: number,
) {
	const left = Math.min(width, Math.max(0, insets.left));
	const top = Math.min(height, Math.max(0, insets.top));
	const right = Math.max(left, width - Math.max(0, insets.right));
	const bottom = Math.max(top, height - Math.max(0, insets.bottom));

	return [
		{ x: left, y: top },
		{ x: right, y: top },
		{ x: right, y: bottom },
		{ x: left, y: bottom },
	];
}

function clampPointToBox(point: RoundbitPoint, width: number, height: number) {
	return {
		x: formatCssNumber(Math.min(width, Math.max(0, point.x))),
		y: formatCssNumber(Math.min(height, Math.max(0, point.y))),
	} satisfies RoundbitPoint;
}

function buildInsetPolygonPointsFromSides(
	outerPoints: RoundbitPoint[],
	insets: RoundbitInsetSides,
	width: number,
	height: number,
) {
	const normalizedInsets = normalizeInsetSides(insets);

	if (outerPoints.length < 2 || areAllInsetsZero(normalizedInsets)) {
		return outerPoints;
	}

	const offsetSegments = buildOffsetSegments(outerPoints, normalizedInsets);
	const insetPoints: RoundbitPoint[] = [];

	for (const [index, segment] of offsetSegments.entries()) {
		const nextSegment = offsetSegments[(index + 1) % offsetSegments.length];
		const intersection = intersectOffsetSegments(segment, nextSegment);

		if (!intersection) {
			continue;
		}

		insetPoints.push(clampPointToBox(intersection, width, height));
	}

	if (insetPoints.length >= 4) {
		return normalizePolygonStart(dedupeAdjacentPoints(insetPoints));
	}

	return normalizePolygonStart(
		buildFallbackInsetPolygon(normalizedInsets, width, height),
	);
}

function normalizePolygonStart(points: RoundbitPoint[]) {
	if (points.length <= 1) {
		return points;
	}

	let bestIndex = 0;

	for (let index = 1; index < points.length; index += 1) {
		const point = points[index];
		const bestPoint = points[bestIndex];

		if (!point || !bestPoint) {
			continue;
		}

		if (
			point.y < bestPoint.y ||
			(point.y === bestPoint.y && point.x < bestPoint.x)
		) {
			bestIndex = index;
		}
	}

	return [...points.slice(bestIndex), ...points.slice(0, bestIndex)];
}

function stitchCornerGroups(cornerGroups: RoundbitPoint[][]) {
	const stitchedPoints: RoundbitPoint[] = [];

	for (const [index, group] of cornerGroups.entries()) {
		if (group.length === 0) {
			continue;
		}

		if (stitchedPoints.length > 0) {
			const previousPoint = stitchedPoints[stitchedPoints.length - 1];
			const nextPoint = group[0];
			const connector = buildEdgeConnector(previousPoint, nextPoint, index - 1);

			if (connector) {
				stitchedPoints.push(connector);
			}
		}

		stitchedPoints.push(...group);
	}

	if (stitchedPoints.length > 1) {
		const closingConnector = buildEdgeConnector(
			stitchedPoints[stitchedPoints.length - 1],
			stitchedPoints[0],
			cornerGroups.length - 1,
		);

		if (closingConnector) {
			stitchedPoints.push(closingConnector);
		}
	}

	return dedupeAdjacentPoints(stitchedPoints);
}

function buildEdgeConnector(
	previousPoint: RoundbitPoint | undefined,
	nextPoint: RoundbitPoint | undefined,
	edgeIndex: number,
) {
	if (!previousPoint || !nextPoint) {
		return null;
	}

	if (previousPoint.x === nextPoint.x || previousPoint.y === nextPoint.y) {
		return null;
	}

	if (edgeIndex === 0 || edgeIndex === 3) {
		return {
			x: nextPoint.x,
			y: previousPoint.y,
		};
	}

	return {
		x: previousPoint.x,
		y: nextPoint.y,
	};
}

function buildCornerPoints(radius: number, step: number) {
	if (radius <= 0) {
		return [{ x: 0, y: 0 }];
	}

	const logicalRadius = resolveLogicalRoundbitRadius(radius, step);
	return buildCornerPointsFromLogicalRadius(logicalRadius, step, radius);
}

function buildCornerPointsFromLogicalRadius(
	logicalRadius: number,
	step: number,
	radiusLimit: number,
) {
	return dedupeAdjacentPoints(
		addCornerBreakpoints(
			flipCornerCoords(
				buildCornerHalfPointsFromLogicalRadius(
					logicalRadius,
					step,
					radiusLimit,
				),
			),
		),
	);
}

function buildTopLeftCorner(radius: number, step: number) {
	return buildCornerPoints(radius, step);
}

function buildTopRightCorner(width: number, radius: number, step: number) {
	return buildCornerPoints(radius, step).map(({ x, y }) => ({
		x: formatCssNumber(width - y),
		y: formatCssNumber(x),
	}));
}

function buildBottomRightCorner(
	width: number,
	height: number,
	radius: number,
	step: number,
) {
	return buildCornerPoints(radius, step).map(({ x, y }) => ({
		x: formatCssNumber(width - x),
		y: formatCssNumber(height - y),
	}));
}

function buildBottomLeftCorner(height: number, radius: number, step: number) {
	return buildCornerPoints(radius, step).map(({ x, y }) => ({
		x: formatCssNumber(y),
		y: formatCssNumber(height - x),
	}));
}

function buildCornerHalfPointsFromLogicalRadius(
	logicalRadius: number,
	step: number,
	radiusLimit: number,
	collapseColumns = false,
) {
	const coords = sampleCornerArc(logicalRadius, step, radiusLimit);
	const trimmedCoords = trimCornerEdgeRuns(coords);
	const mergedCoords = collapseColumns
		? collapseCornerColumns(trimmedCoords)
		: trimmedCoords;
	return addCornerBreakpoints(
		mergedCoords.length > 0 ? mergedCoords : [{ x: 0, y: 0 }],
	);
}

function trimCornerEdgeRuns(coords: RoundbitPoint[]) {
	return coords.reduce<RoundbitPoint[]>((result, point, index, array) => {
		if (
			index !== array.length - 1 &&
			point.x === 0 &&
			array[index + 1]?.x === 0
		) {
			return result;
		}

		if (index !== 0 && point.y === 0 && array[index - 1]?.y === 0) {
			return result;
		}

		result.push(point);
		return result;
	}, []);
}

function collapseCornerColumns(coords: RoundbitPoint[]) {
	return coords.reduce<RoundbitPoint[]>((result, point, index, array) => {
		if (
			index > 0 &&
			index < array.length - 1 &&
			point.x === array[index - 1]?.x &&
			point.x === array[index + 1]?.x
		) {
			return result;
		}

		result.push(point);
		return result;
	}, []);
}

function flipCornerCoords(coords: RoundbitPoint[]) {
	return [
		...coords,
		...coords.map(({ x, y }) => ({ x: y, y: x })).reverse(),
	].filter((point, index, array) => {
		if (index === 0) {
			return true;
		}

		const previousPoint = array[index - 1];
		return previousPoint?.x !== point.x || previousPoint.y !== point.y;
	});
}

function addCornerBreakpoints(coords: RoundbitPoint[]) {
	return coords.reduce<RoundbitPoint[]>((result, point, index) => {
		result.push(point);

		const nextPoint = coords[index + 1];
		if (!nextPoint) {
			return result;
		}

		if (nextPoint.x !== point.x && nextPoint.y !== point.y) {
			result.push({
				x: nextPoint.x,
				y: point.y,
			});
		}

		return result;
	}, []);
}

function dedupeAdjacentPoints(points: RoundbitPoint[]) {
	return points.filter((point, index, array) => {
		if (index === 0) {
			return true;
		}

		const previousPoint = array[index - 1];
		return previousPoint?.x !== point.x || previousPoint.y !== point.y;
	});
}

function clampRoundbitCorners(
	corners: RoundbitCornerValues,
	width: number,
	height: number,
): RoundbitCornerValues {
	if (width <= 0 || height <= 0) {
		return {
			bottomLeft: 0,
			bottomRight: 0,
			topLeft: 0,
			topRight: 0,
		};
	}

	const normalized = {
		bottomLeft: normalizeRadius(corners.bottomLeft, width, height),
		bottomRight: normalizeRadius(corners.bottomRight, width, height),
		topLeft: normalizeRadius(corners.topLeft, width, height),
		topRight: normalizeRadius(corners.topRight, width, height),
	};
	const topScale =
		normalized.topLeft + normalized.topRight > 0
			? width / (normalized.topLeft + normalized.topRight)
			: 1;
	const bottomScale =
		normalized.bottomLeft + normalized.bottomRight > 0
			? width / (normalized.bottomLeft + normalized.bottomRight)
			: 1;
	const leftScale =
		normalized.topLeft + normalized.bottomLeft > 0
			? height / (normalized.topLeft + normalized.bottomLeft)
			: 1;
	const rightScale =
		normalized.topRight + normalized.bottomRight > 0
			? height / (normalized.topRight + normalized.bottomRight)
			: 1;
	const scale = Math.min(topScale, bottomScale, leftScale, rightScale, 1);

	return {
		bottomLeft: formatCssNumber(normalized.bottomLeft * scale),
		bottomRight: formatCssNumber(normalized.bottomRight * scale),
		topLeft: formatCssNumber(normalized.topLeft * scale),
		topRight: formatCssNumber(normalized.topRight * scale),
	};
}

function normalizeRadius(value: number, width: number, height: number) {
	if (!Number.isFinite(value) || value > 1_000_000) {
		return Math.min(width, height) / 2;
	}

	return Math.max(0, value);
}

function normalizeStep(step: number) {
	if (!Number.isFinite(step) || step <= 0) {
		return DEFAULT_ROUNDBIT_STEP;
	}

	return Math.max(1, formatCssNumber(step));
}

function quantizeInsetToStep(value: number, step: number) {
	if (!Number.isFinite(value) || value <= 0) {
		return 0;
	}

	return formatCssNumber(Math.ceil(value / step) * step);
}

function quantizeCoordinate(value: number, step: number) {
	if (!Number.isFinite(value)) {
		return 0;
	}

	return formatCssNumber(Math.max(0, Math.round(value / step) * step));
}

function clampCornerCoordinate(value: number, step: number, radius: number) {
	return Math.min(radius, quantizeCoordinate(value, step));
}

function resolveLogicalRoundbitRadius(radius: number, step: number) {
	const desiredVisualRadius = radius / step;

	if (!Number.isFinite(desiredVisualRadius) || desiredVisualRadius <= 0) {
		return 0;
	}

	let bestRadius = desiredVisualRadius;
	let bestDistance = Number.POSITIVE_INFINITY;
	const maxCandidate = Math.max(1, Math.ceil(desiredVisualRadius * 2));

	for (let candidate = 1; candidate <= maxCandidate; candidate += 1) {
		const visualOffset = measureVisualCornerOffset(candidate);
		const distance = Math.abs(visualOffset - desiredVisualRadius);

		if (distance < bestDistance) {
			bestRadius = candidate;
			bestDistance = distance;
		}
	}

	return bestRadius;
}

function measureVisualCornerOffset(logicalRadius: number) {
	return (
		buildCornerPointsFromLogicalRadius(logicalRadius, 1, logicalRadius)[0]?.y ??
		0
	);
}

function sampleCornerArc(
	logicalRadius: number,
	step: number,
	radiusLimit: number,
) {
	const coords: RoundbitPoint[] = [];
	let previousX = Number.NaN;
	let previousY = Number.NaN;

	for (let degrees = 270; degrees > 225; degrees -= 1) {
		const radians = (2 * Math.PI * degrees) / 360;
		const x = clampCornerCoordinate(
			Math.trunc(logicalRadius * Math.sin(radians) + logicalRadius + 0.5) *
				step,
			step,
			radiusLimit,
		);
		const y = clampCornerCoordinate(
			Math.trunc(logicalRadius * Math.cos(radians) + logicalRadius + 0.5) *
				step,
			step,
			radiusLimit,
		);

		if (x === previousX && y === previousY) {
			continue;
		}

		previousX = x;
		previousY = y;
		coords.push({ x, y });
	}

	return coords;
}

function formatCssNumber(value: number) {
	return Object.is(value, -0) ? 0 : Math.round(value * 1000) / 1000;
}

function pointToCssValue(point: RoundbitPoint) {
	return `${formatCssNumber(point.x)}px ${formatCssNumber(point.y)}px`;
}

function resolveRootNode(root: ParentNode | Document | Element) {
	if (root instanceof Document) {
		return root.documentElement;
	}

	return root;
}

function shouldTrackRoundbitElement(element: HTMLElement) {
	const className = element.getAttribute("class") ?? "";

	if (!ROUND_BIT_CLASS_PATTERN.test(className)) {
		return false;
	}

	return !element.classList.contains("roundbit-content");
}

function isQueryableNode(node: Node): node is Node & ParentNode {
	return "querySelectorAll" in node;
}

function clearRoundbitState(element: HTMLElement) {
	updateManagedRoundbitStyles(element, () => {
		element.style.removeProperty("--roundbit-clip-path");
		element.style.removeProperty("--roundbit-outline-clip-path");
		element.style.removeProperty("--roundbit-middle-clip-path");
		element.style.removeProperty("--roundbit-inner-clip-path");
		element.style.removeProperty("--roundbit-border-image");
		element.style.removeProperty("--roundbit-outline-fill");
		element.style.removeProperty("--roundbit-shadow-filter");
		element.style.removeProperty("--roundbit-content-inset");
		element.style.removeProperty("--roundbit-content-top-inset");
		element.style.removeProperty("--roundbit-content-right-inset");
		element.style.removeProperty("--roundbit-content-bottom-inset");
		element.style.removeProperty("--roundbit-content-left-inset");
		element.style.removeProperty("--roundbit-outline-width");
		element.style.removeProperty("--roundbit-snap-x");
		element.style.removeProperty("--roundbit-snap-y");
	});
	element.dataset.roundbitProxyBorder = "false";
	element.dataset.roundbitProxyOutline = "false";
	element.dataset.roundbitProxyShadow = "false";
	element.dataset.roundbitBorderRenderer = "none";
	element.dataset.roundbitSnapped = "false";

	const content = getFrameContent(element);
	if (content) {
		updateManagedRoundbitStyles(content, () => {
			content.style.removeProperty("--roundbit-inner-clip-path");
		});
	}
}

function refreshRoundbitElement(element: HTMLElement) {
	if (!element.isConnected) {
		return;
	}

	if (element.classList.contains("roundbit-frame")) {
		applyRoundbitFrame(element);
		return;
	}

	applyRoundbitDirect(element);
}

function applyRoundbitDirect(element: HTMLElement) {
	const size = readElementBoxSize(element);
	if (size.width <= 0 || size.height <= 0) {
		clearRoundbitState(element);
		return;
	}

	const result = buildRoundbitPaths({
		corners: readComputedCorners(element, size.width, size.height),
		height: size.height,
		step: readRoundbitStep(element),
		width: size.width,
	});

	updateManagedRoundbitStyles(element, () => {
		element.style.setProperty("--roundbit-clip-path", result.clipPath);
	});

	applyRoundbitPixelSnap(element);
}

function applyRoundbitFrame(frame: HTMLElement) {
	const content = getFrameContent(frame);
	if (!content) {
		applyRoundbitDirect(frame);
		return;
	}

	clearRoundbitState(frame);

	const size = readElementBoxSize(frame);
	if (size.width <= 0 || size.height <= 0) {
		return;
	}

	const corners = readComputedCorners(frame, size.width, size.height);
	const step = readRoundbitStep(frame);
	const effects = readFrameEffects(frame);
	const borderWidths = quantizeInsetSides(effects.border.widths, step);
	const outlineInsets = buildUniformInsetSides(
		quantizeInsetToStep(effects.proxyOutlineWidth, step),
	);
	const contentInsets = addInsetSides(borderWidths, outlineInsets);
	const outer = buildRoundbitPaths({
		corners,
		height: size.height,
		step,
		width: size.width,
	});
	const outerPoints = buildPolygonPoints(
		size.width,
		size.height,
		corners,
		step,
	);
	const middlePoints = buildInsetPolygonPointsFromSides(
		outerPoints,
		outlineInsets,
		size.width,
		size.height,
	);
	const innerPoints = buildInsetPolygonPointsFromSides(
		middlePoints,
		borderWidths,
		size.width,
		size.height,
	);
	const outlineClipPath = buildBandPolygonValue(
		outerPoints,
		middlePoints,
		0,
		outlineInsets.top,
	);
	const middleClipPath = buildPolygonValue(middlePoints);
	const innerClipPath = buildPolygonValue(innerPoints);
	const borderImage = buildRoundbitBorderImage({
		border: effects.border,
		height: size.height,
		innerPoints,
		outerPoints: middlePoints,
		width: size.width,
	});

	updateManagedRoundbitStyles(frame, () => {
		frame.style.setProperty("--roundbit-clip-path", outer.clipPath);
		frame.style.setProperty("--roundbit-outline-clip-path", outlineClipPath);
		frame.style.setProperty("--roundbit-middle-clip-path", middleClipPath);
		frame.style.setProperty("--roundbit-inner-clip-path", innerClipPath);
		frame.style.setProperty(
			"--roundbit-content-top-inset",
			`${contentInsets.top}px`,
		);
		frame.style.setProperty(
			"--roundbit-content-right-inset",
			`${contentInsets.right}px`,
		);
		frame.style.setProperty(
			"--roundbit-content-bottom-inset",
			`${contentInsets.bottom}px`,
		);
		frame.style.setProperty(
			"--roundbit-content-left-inset",
			`${contentInsets.left}px`,
		);
		frame.style.setProperty(
			"--roundbit-content-inset",
			`${maxInsetSide(contentInsets)}px`,
		);
		frame.style.setProperty(
			"--roundbit-outline-width",
			`${outlineInsets.top}px`,
		);
		frame.style.setProperty(
			"--roundbit-outline-fill",
			effects.proxyOutlineColor,
		);
		frame.style.setProperty("--roundbit-border-image", borderImage ?? "none");
		frame.style.setProperty(
			"--roundbit-shadow-filter",
			effects.proxyShadowFilter ?? "none",
		);
	});
	frame.dataset.roundbitProxyBorder = String(effects.border.hasVisibleBorder);
	frame.dataset.roundbitProxyOutline = String(effects.proxyOutline);
	frame.dataset.roundbitProxyShadow = String(effects.proxyShadow);
	frame.dataset.roundbitBorderRenderer = effects.renderer;

	updateManagedRoundbitStyles(content, () => {
		content.style.setProperty("--roundbit-inner-clip-path", innerClipPath);
	});

	applyRoundbitPixelSnap(frame);
}

function readElementBoxSize(element: HTMLElement) {
	const width = Math.max(0, element.offsetWidth);
	const height = Math.max(0, element.offsetHeight);

	if (width > 0 && height > 0) {
		return { height, width };
	}

	const rect = element.getBoundingClientRect();

	return {
		height: Math.max(0, Math.round(rect.height)),
		width: Math.max(0, Math.round(rect.width)),
	};
}

function applyRoundbitPixelSnap(element: HTMLElement) {
	const rect = element.getBoundingClientRect();
	const snapX = getPixelSnapDelta(rect.left);
	const snapY = getPixelSnapDelta(rect.top);
	const shouldSnap = snapX !== 0 || snapY !== 0;

	updateManagedRoundbitStyles(element, () => {
		if (shouldSnap) {
			element.style.setProperty("--roundbit-snap-x", `${snapX}px`);
			element.style.setProperty("--roundbit-snap-y", `${snapY}px`);
			return;
		}

		element.style.removeProperty("--roundbit-snap-x");
		element.style.removeProperty("--roundbit-snap-y");
	});
	element.dataset.roundbitSnapped = String(shouldSnap);
}

function getPixelSnapDelta(value: number) {
	if (!Number.isFinite(value)) {
		return 0;
	}

	const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
	const devicePixel = 1 / devicePixelRatio;
	const snappedValue = Math.round(value / devicePixel) * devicePixel;

	return formatCssNumber(snappedValue - value);
}

function getFrameContent(frame: HTMLElement) {
	for (const child of frame.children) {
		if (
			child instanceof HTMLElement &&
			child.classList.contains("roundbit-content")
		) {
			return child;
		}
	}

	return null;
}

function readFrameEffects(frame: HTMLElement) {
	const computed = window.getComputedStyle(frame);
	const border = readRoundbitBorderConfig(frame, computed);
	const outlineWidth = parsePixelValue(computed.outlineWidth);
	const proxyOutline =
		outlineWidth > 0 &&
		computed.outlineStyle === "solid" &&
		parsePixelValue(computed.outlineOffset) === 0;
	const proxyShadowFilter = translateBoxShadowToFilter(computed.boxShadow);
	const proxyShadow = proxyShadowFilter !== null;
	const proxyOutlineWidth = proxyOutline ? outlineWidth : 0;
	const renderer = resolveBorderRenderer(border);

	return {
		border,
		proxyOutline,
		proxyOutlineColor: proxyOutline ? computed.outlineColor : "transparent",
		proxyOutlineWidth,
		proxyShadow,
		proxyShadowFilter,
		renderer,
	} satisfies RoundbitFrameEffects;
}

function readRoundbitBorderConfig(
	frame: HTMLElement,
	computed = window.getComputedStyle(frame),
): RoundbitBorderConfig {
	const dedicatedSource = hasDedicatedRoundbitBorderSource(computed);
	const widths = readComputedBorderWidths(computed);
	const colors = readComputedBorderColors(computed);
	const styles = readComputedBorderStyles(computed);
	const uniformWidth = getUniformValue(Object.values(widths));
	const uniformColor = getUniformValue(Object.values(colors));
	const uniformStyle = getUniformValue(styles);
	const style = normalizeBorderStyle(uniformStyle);
	const hasVisibleBorder =
		style !== "hidden" && style !== "none" && maxInsetSide(widths) > 0;

	return {
		colors,
		hasVisibleBorder,
		source: dedicatedSource
			? "dedicated"
			: hasVisibleBorder
				? "native"
				: "none",
		style,
		uniformColor,
		uniformWidth,
		widths,
	};
}

function hasDedicatedRoundbitBorderSource(computed: CSSStyleDeclaration) {
	return computed.getPropertyValue("--roundbit-border-source").trim() !== "";
}

function readComputedBorderWidths(
	computed: CSSStyleDeclaration,
): RoundbitInsetSides {
	return {
		bottom: parsePixelValue(computed.borderBottomWidth),
		left: parsePixelValue(computed.borderLeftWidth),
		right: parsePixelValue(computed.borderRightWidth),
		top: parsePixelValue(computed.borderTopWidth),
	};
}

function readComputedBorderColors(
	computed: CSSStyleDeclaration,
): RoundbitColorSides {
	return {
		bottom: computed.borderBottomColor,
		left: computed.borderLeftColor,
		right: computed.borderRightColor,
		top: computed.borderTopColor,
	};
}

function readComputedBorderStyles(computed: CSSStyleDeclaration) {
	return [
		computed.borderTopStyle,
		computed.borderRightStyle,
		computed.borderBottomStyle,
		computed.borderLeftStyle,
	] as const;
}

function normalizeBorderStyle(
	value: string | null | undefined,
): RoundbitBorderStyle {
	switch (value) {
		case "dashed":
		case "dotted":
		case "double":
		case "hidden":
		case "none":
		case "solid":
			return value;
		default:
			return "solid";
	}
}

function resolveBorderRenderer(
	border: RoundbitBorderConfig,
): RoundbitBorderRenderer {
	if (
		!border.hasVisibleBorder ||
		border.style === "hidden" ||
		border.style === "none"
	) {
		return "none";
	}

	return "svg";
}

function buildRoundbitBorderImage({
	border,
	height,
	innerPoints,
	outerPoints,
	width,
}: {
	border: RoundbitBorderConfig;
	height: number;
	innerPoints: RoundbitPoint[];
	outerPoints: RoundbitPoint[];
	width: number;
}) {
	if (!border.hasVisibleBorder) {
		return null;
	}

	if (
		(border.style === "dashed" ||
			border.style === "dotted" ||
			border.style === "double") &&
		(border.uniformColor === null || border.uniformWidth === null)
	) {
		border = {
			...border,
			style: "solid",
		};
	}

	const svg =
		border.style === "solid"
			? buildSolidBorderSvg({
					border,
					height,
					innerPoints,
					outerPoints,
					width,
				})
			: buildStyledBorderSvg({
					border,
					height,
					outerPoints,
					width,
				});

	if (!svg) {
		return null;
	}

	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function buildSolidBorderSvg({
	border,
	height,
	innerPoints,
	outerPoints,
	width,
}: {
	border: RoundbitBorderConfig;
	height: number;
	innerPoints: RoundbitPoint[];
	outerPoints: RoundbitPoint[];
	width: number;
}) {
	if (border.uniformColor) {
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="none" shape-rendering="crispEdges"><path fill="${escapeSvgAttribute(border.uniformColor)}" fill-rule="evenodd" d="${buildSvgPathData(outerPoints)} ${buildSvgPathData([...innerPoints].reverse())}"/></svg>`;
	}

	const polygons = buildSideBandPolygons(
		outerPoints,
		innerPoints,
		border.colors,
	)
		.map(({ color, points }) => {
			if (!color || isTransparentColor(color)) {
				return "";
			}

			return `<polygon fill="${escapeSvgAttribute(color)}" points="${points
				.map(({ x, y }) => `${x},${y}`)
				.join(" ")}"/>`;
		})
		.filter(Boolean)
		.join("");

	if (!polygons) {
		return null;
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="none" shape-rendering="crispEdges">${polygons}</svg>`;
}

function buildStyledBorderSvg({
	border,
	height,
	outerPoints,
	width,
}: {
	border: RoundbitBorderConfig;
	height: number;
	outerPoints: RoundbitPoint[];
	width: number;
}) {
	if (border.uniformColor === null || border.uniformWidth === null) {
		return null;
	}

	const strokeColor = escapeSvgAttribute(border.uniformColor);

	if (border.style === "double") {
		const strokeWidth = Math.max(1, formatCssNumber(border.uniformWidth / 3));
		const outerPath = buildInsetPolygonPointsFromSides(
			outerPoints,
			scaleInsetSides(border.widths, 1 / 6),
			width,
			height,
		);
		const innerPath = buildInsetPolygonPointsFromSides(
			outerPoints,
			scaleInsetSides(border.widths, 5 / 6),
			width,
			height,
		);

		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="none" shape-rendering="crispEdges"><path d="${buildSvgPathData(outerPath)}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="miter"/><path d="${buildSvgPathData(innerPath)}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="miter"/></svg>`;
	}

	const centerline = buildInsetPolygonPointsFromSides(
		outerPoints,
		scaleInsetSides(border.widths, 0.5),
		width,
		height,
	);
	const dashArray =
		border.style === "dotted"
			? `0 ${Math.max(2, formatCssNumber(border.uniformWidth * 1.75))}`
			: `${formatCssNumber(border.uniformWidth * 2)} ${formatCssNumber(border.uniformWidth * 1.5)}`;
	const lineCap = border.style === "dotted" ? "round" : "butt";

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="none" shape-rendering="crispEdges"><path d="${buildSvgPathData(centerline)}" fill="none" stroke="${strokeColor}" stroke-width="${border.uniformWidth}" stroke-dasharray="${dashArray}" stroke-linecap="${lineCap}" stroke-linejoin="miter"/></svg>`;
}

function buildSideBandPolygons(
	outerPoints: RoundbitPoint[],
	innerPoints: RoundbitPoint[],
	colors: RoundbitColorSides,
) {
	const polygons: Array<{ color: string; points: RoundbitPoint[] }> = [];
	const segmentCount = Math.min(outerPoints.length, innerPoints.length);

	for (let index = 0; index < segmentCount; index += 1) {
		const outerStart = outerPoints[index];
		const outerEnd = outerPoints[(index + 1) % segmentCount];
		const innerStart = innerPoints[index];
		const innerEnd = innerPoints[(index + 1) % segmentCount];

		if (!outerStart || !outerEnd || !innerStart || !innerEnd) {
			continue;
		}

		const side = classifySegmentSide(outerStart, outerEnd);
		const color = side ? colors[side] : null;

		if (!side || !color) {
			continue;
		}

		const polygon = dedupeAdjacentPoints([
			outerStart,
			outerEnd,
			innerEnd,
			innerStart,
		]);

		if (polygon.length < 3) {
			continue;
		}

		polygons.push({
			color,
			points: polygon,
		});
	}

	return polygons;
}

function classifySegmentSide(
	start: RoundbitPoint,
	end: RoundbitPoint,
): keyof RoundbitInsetSides | null {
	if (start.y === end.y) {
		return end.x >= start.x ? "top" : "bottom";
	}

	if (start.x === end.x) {
		return end.y >= start.y ? "right" : "left";
	}

	return null;
}

function buildSvgPathData(points: RoundbitPoint[]) {
	const first = points[0];

	if (!first) {
		return "";
	}

	const rest = points.slice(1);
	return `M ${first.x} ${first.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(" ")} Z`;
}

function escapeSvgAttribute(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function isTransparentColor(value: string) {
	const normalized = value.trim().toLowerCase();
	return (
		normalized === "transparent" ||
		normalized === "rgba(0, 0, 0, 0)" ||
		normalized === "rgb(0 0 0 / 0)"
	);
}

function readComputedCorners(
	element: HTMLElement,
	width: number,
	height: number,
): RoundbitCornerValues {
	const computed = window.getComputedStyle(element);
	const reference = Math.min(width, height);

	return {
		bottomLeft: parseRadiusValue(computed.borderBottomLeftRadius, reference),
		bottomRight: parseRadiusValue(computed.borderBottomRightRadius, reference),
		topLeft: parseRadiusValue(computed.borderTopLeftRadius, reference),
		topRight: parseRadiusValue(computed.borderTopRightRadius, reference),
	};
}

function readRoundbitStep(element: HTMLElement) {
	const computed = window.getComputedStyle(element);
	const rawStep = computed.getPropertyValue("--roundbit-step").trim();

	if (!rawStep) {
		return DEFAULT_ROUNDBIT_STEP;
	}

	const parsedStep = parseRadiusValue(rawStep, DEFAULT_ROUNDBIT_STEP);
	return normalizeStep(parsedStep);
}

function parseRadiusValue(value: string, reference: number) {
	const normalizedValue = value.trim();
	if (!normalizedValue) {
		return 0;
	}

	if (normalizedValue.includes("infinity")) {
		return Number.POSITIVE_INFINITY;
	}

	const firstToken = normalizedValue.split(/\s+/)[0] ?? normalizedValue;
	if (firstToken.endsWith("%")) {
		const percentage = Number.parseFloat(firstToken);
		return Number.isFinite(percentage) ? (reference * percentage) / 100 : 0;
	}

	const numericValue = Number.parseFloat(firstToken);
	return Number.isFinite(numericValue) ? numericValue : 0;
}

function parsePixelValue(value: string) {
	const numericValue = Number.parseFloat(value);
	return Number.isFinite(numericValue) ? numericValue : 0;
}

function getUniformValue<T>(values: readonly T[]) {
	const [first, ...rest] = values;

	if (first === undefined) {
		return null;
	}

	return rest.every((value) => value === first) ? first : null;
}

function translateBoxShadowToFilter(boxShadow: string) {
	if (!boxShadow || boxShadow === "none") {
		return null;
	}

	const filters = splitTopLevelCommaList(boxShadow)
		.map((shadow) => shadow.trim())
		.filter(Boolean)
		.flatMap((shadow) => {
			if (shadow.includes("inset")) {
				return [];
			}

			const colorMatch = shadow.match(
				/(rgba?\([^)]+\)|hsla?\([^)]+\)|oklch\([^)]+\)|oklab\([^)]+\)|lab\([^)]+\)|lch\([^)]+\)|color\([^)]+\))/i,
			);
			const color = colorMatch?.[0] ?? "currentColor";
			const shadowWithoutColor = shadow.replace(color, "").trim();
			const lengths = matchBoxShadowLengths(shadowWithoutColor);
			const [offsetX = "0px", offsetY = "0px", blur = "0px", spread = "0px"] =
				lengths;

			if (Number.parseFloat(spread) !== 0) {
				return [];
			}

			return [`drop-shadow(${offsetX} ${offsetY} ${blur} ${color})`];
		});

	return filters.length > 0 ? filters.join(" ") : null;
}

function matchBoxShadowLengths(value: string) {
	return (
		value
			.match(/-?(?:\d*\.?\d+px|0(?:\.0+)?)/g)
			?.map((token) => (token.endsWith("px") ? token : `${token}px`)) ?? []
	);
}

function splitTopLevelCommaList(value: string) {
	const parts: string[] = [];
	let depth = 0;
	let currentValue = "";

	for (const character of value) {
		if (character === "(") {
			depth += 1;
		} else if (character === ")") {
			depth = Math.max(0, depth - 1);
		}

		if (character === "," && depth === 0) {
			parts.push(currentValue);
			currentValue = "";
			continue;
		}

		currentValue += character;
	}

	if (currentValue.trim()) {
		parts.push(currentValue);
	}

	return parts;
}

function updateManagedRoundbitStyles(
	element: HTMLElement,
	callback: () => void,
) {
	if (!managedRoundbitStyleMutationState) {
		managedRoundbitStyleMutationState = new WeakMap<HTMLElement, number>();
	}

	const state = managedRoundbitStyleMutationState;
	state.set(element, (state.get(element) ?? 0) + 1);

	try {
		callback();
	} finally {
		queueMicrotask(() => {
			const nextCount = (state.get(element) ?? 1) - 1;

			if (nextCount <= 0) {
				state.delete(element);
				return;
			}

			state.set(element, nextCount);
		});
	}
}

function isManagedRoundbitStyleMutation(element: HTMLElement) {
	return (managedRoundbitStyleMutationState?.get(element) ?? 0) > 0;
}

let managedRoundbitStyleMutationState: WeakMap<HTMLElement, number> | null =
	null;
