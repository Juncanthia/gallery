/**
 * Serializable AI tool return payloads.
 *
 * Use these types when defining tool handlers that render agent-tools UI components.
 */
export type { SerializableChart, ChartDataPoint } from "./chart/schema";
export type { SerializableGeoMap, GeoMapMarker, GeoMapRoute } from "./geo-map/schema";
export type {
  WeatherWidgetPayload,
  WeatherWidgetCurrent,
  WeatherWidgetLocation,
  WeatherWidgetTime,
  ForecastDay,
  WeatherConditionCode,
  TemperatureUnit,
  PrecipitationLevel,
} from "./weather-widget/schema-runtime";
