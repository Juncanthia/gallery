"use client"

import { BadgeOverflow } from "@/components/ui/badge-overflow"

const items = [
  { label: "React", color: "bg-sky-100 text-sky-700" },
  { label: "TypeScript", color: "bg-blue-100 text-blue-700" },
  { label: "Tailwind CSS", color: "bg-teal-100 text-teal-700" },
  { label: "Next.js", color: "bg-gray-100 text-gray-700" },
  { label: "Vue", color: "bg-green-100 text-green-700" },
  { label: "Svelte", color: "bg-orange-100 text-orange-700" },
  { label: "Angular", color: "bg-red-100 text-red-700" },
  { label: "Remix", color: "bg-purple-100 text-purple-700" },
  { label: "Astro", color: "bg-pink-100 text-pink-700" },
  { label: "Nuxt", color: "bg-emerald-100 text-emerald-700" },
]

export default function Demo() {
  return (
    <div className="w-full max-w-md">
      <BadgeOverflow
        items={items}
        getBadgeLabel={(item) => item.label}
        lineCount={2}
        renderBadge={(item, _label) => (
          <span
            className={`inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-xs font-medium ${item.color}`}
          >
            {item.label}
          </span>
        )}
        renderOverflow={(count) => (
          <span className="inline-flex h-5 shrink-0 items-center rounded-md border px-1.5 text-xs font-semibold">
            +{count}
          </span>
        )}
      />
    </div>
  )
}
