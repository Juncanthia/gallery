import {
  MiniCalendar,
  MiniCalendarNavigation,
  MiniCalendarDays,
  MiniCalendarDay,
} from "@/components/blocks/mini-calendar"

export default function MiniCalendarBasicExample() {
  return (
    <MiniCalendar>
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>
        {(date) => (
          <MiniCalendarDay key={date.toISOString()} date={date} />
        )}
      </MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  )
}
