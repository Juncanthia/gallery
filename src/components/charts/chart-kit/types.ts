/**
 * Shared chart-kit types for visx/d3 integrations.
 * Prefer importing from here instead of duplicating local `any` aliases.
 */

/** d3 curve factory accepted by @visx/shape line/area generators. */
export type { CurveFactory, CurveFactoryLineOnly } from "d3-shape";

/** GeoJSON objects accepted by d3-geo path generators (features, graticule, etc.). */
export type { GeoPermissibleObjects } from "d3-geo";
