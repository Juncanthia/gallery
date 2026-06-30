import { WeatherWidget } from "@/components/ui/tool-weather-widget"

export default function Demo() {
  return (
    <WeatherWidget
      version="3.1"
      id="weather-demo"
      location={{ name: "北京" }}
      units={{ temperature: "celsius" }}
      current={{
        conditionCode: "partly-cloudy",
        temperature: 22,
        tempMin: 18,
        tempMax: 26,
        windSpeed: 12,
        precipitationLevel: "none",
        visibility: 10,
      }}
      forecast={[
        { label: "周一", conditionCode: "clear", tempMin: 19, tempMax: 27 },
        { label: "周二", conditionCode: "partly-cloudy", tempMin: 20, tempMax: 25 },
        { label: "周三", conditionCode: "rain", tempMin: 17, tempMax: 22 },
        { label: "周四", conditionCode: "cloudy", tempMin: 16, tempMax: 23 },
        { label: "周五", conditionCode: "clear", tempMin: 18, tempMax: 28 },
      ]}
      time={{ timeBucket: 5 }}
      updatedAt="2026-06-30T14:00:00Z"
      effects={{ enabled: true, quality: "medium" }}
    />
  )
}
