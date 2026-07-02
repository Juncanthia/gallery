"use client"

import { RelativeTimeCard } from "@/components/data-display/blocks/relative-time-card"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <RelativeTimeCard
        date={new Date(Date.now() - 1000 * 60 * 5)}
        timezones={["Asia/Shanghai", "America/New_York", "Europe/London"]}
      />
      <RelativeTimeCard
        date={new Date(Date.now() + 1000 * 60 * 60 * 3)}
        timezones={["Asia/Tokyo", "Pacific/Auckland"]}
        variant="muted"
      />
      <RelativeTimeCard
        date={new Date("2025-01-01T00:00:00Z")}
        variant="ghost"
      />
    </div>
  )
}
