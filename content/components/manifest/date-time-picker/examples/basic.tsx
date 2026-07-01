import { DateTimePicker } from "@/components/ui/date-time-picker"

export default function Demo() {
  return (
    <div className="flex justify-center p-4">
      <DateTimePicker
        data={{
          title: "Select a Date & Time",
          availableDates: [
            new Date(2026, 6, 1),
            new Date(2026, 6, 2),
            new Date(2026, 6, 3),
            new Date(2026, 6, 7),
            new Date(2026, 6, 8),
            new Date(2026, 6, 9),
            new Date(2026, 6, 10),
            new Date(2026, 6, 14),
            new Date(2026, 6, 15),
            new Date(2026, 6, 16),
            new Date(2026, 6, 17),
            new Date(2026, 6, 21),
            new Date(2026, 6, 22),
            new Date(2026, 6, 23),
            new Date(2026, 6, 24),
            new Date(2026, 6, 28),
            new Date(2026, 6, 29),
            new Date(2026, 6, 30),
          ],
          availableTimeSlots: [
            "9:00am",
            "10:00am",
            "11:30am",
            "1:00pm",
            "2:30pm",
            "4:00pm",
          ],
          timezone: "Eastern Time - US & Canada",
        }}
        appearance={{
          showTitle: true,
          showTimezone: true,
          weekStartsOn: "sunday",
        }}
      />
    </div>
  )
}
