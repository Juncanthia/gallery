import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttToday,
} from "@/components/blocks/gantt"
import type { GanttFeature } from "@/components/blocks/gantt"

const features: GanttFeature[] = [
  {
    id: "1",
    name: "User Authentication",
    startAt: new Date(2025, 0, 15),
    endAt: new Date(2025, 2, 1),
    blocks/status: { id: "active", name: "In Progress", color: "#3b82f6" },
    lane: "frontend",
  },
  {
    id: "2",
    name: "Dashboard Analytics",
    startAt: new Date(2025, 2, 1),
    endAt: new Date(2025, 4, 30),
    blocks/status: { id: "planned", name: "Planned", color: "#f59e0b" },
    lane: "frontend",
  },
  {
    id: "3",
    name: "API Integration",
    startAt: new Date(2025, 1, 1),
    endAt: new Date(2025, 3, 15),
    blocks/status: { id: "completed", name: "Completed", color: "#22c55e" },
    lane: "backend",
  },
  {
    id: "4",
    name: "Payment Module",
    startAt: new Date(2025, 3, 1),
    endAt: new Date(2025, 5, 30),
    blocks/status: { id: "planned", name: "Planned", color: "#f59e0b" },
    lane: "backend",
  },
  {
    id: "5",
    name: "Notification System",
    startAt: new Date(2025, 0, 1),
    endAt: new Date(2025, 1, 28),
    blocks/status: { id: "completed", name: "Completed", color: "#22c55e" },
    lane: "frontend",
  },
]

export default function GanttBasicExample() {
  return (
    <GanttProvider range="monthly">
      <GanttSidebar>
        <GanttSidebarGroup name="Q1-Q2 2025">
          {features.map((feature) => (
            <GanttSidebarItem key={feature.id} feature={feature} />
          ))}
        </GanttSidebarGroup>
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          <GanttFeatureListGroup>
            <GanttFeatureRow features={features} />
          </GanttFeatureListGroup>
        </GanttFeatureList>
        <GanttToday />
      </GanttTimeline>
    </GanttProvider>
  )
}
