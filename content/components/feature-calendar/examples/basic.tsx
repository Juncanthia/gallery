import { CalendarBody } from "@/components/ui/feature-calendar"

const features = [
  { id: "1", name: "首页改版", startAt: new Date(2025, 0, 6), endAt: new Date(2025, 0, 15), status: "success" as const },
  { id: "2", name: "API 优化", startAt: new Date(2025, 0, 10), endAt: new Date(2025, 0, 20), status: "processing" as const },
  { id: "3", name: "文档更新", startAt: new Date(2025, 0, 18), endAt: new Date(2025, 0, 25), status: "warning" as const },
]

export default function CalendarBodyBasicExample() {
  return <CalendarBody features={features} className="w-full max-w-sm" />
}
