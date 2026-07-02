import {
  RelativeTime,
  RelativeTimeZone,
  RelativeTimeZoneDate,
  RelativeTimeZoneDisplay,
  RelativeTimeZoneLabel,
} from "@/components/blocks/relative-time"

export default function RelativeTimeBasicExample() {
  return (
    <RelativeTime className="w-full max-w-xs">
      <RelativeTimeZone zone="America/New_York">
        <RelativeTimeZoneLabel>NYC</RelativeTimeZoneLabel>
        <RelativeTimeZoneDate />
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>
      <RelativeTimeZone zone="Europe/London">
        <RelativeTimeZoneLabel>London</RelativeTimeZoneLabel>
        <RelativeTimeZoneDate />
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>
      <RelativeTimeZone zone="Asia/Shanghai">
        <RelativeTimeZoneLabel>北京</RelativeTimeZoneLabel>
        <RelativeTimeZoneDate />
        <RelativeTimeZoneDisplay />
      </RelativeTimeZone>
    </RelativeTime>
  )
}
