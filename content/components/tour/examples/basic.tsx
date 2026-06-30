"use client"

import { useState } from "react"
import { Tour, type TourStepConfig } from "@/components/ui/tour"
import { Button } from "@/components/ui/button"

const steps: TourStepConfig[] = [
  {
    title: "Welcome",
    description:
      "This guided tour will walk you through the key features of the dashboard.",
    placement: "center",
  },
  {
    title: "Analytics Overview",
    description:
      "View your key metrics, trends, and performance indicators all in one place.",
    placement: "center",
  },
  {
    title: "Ready to Explore",
    description:
      "You are all set! Click Done to start using the dashboard on your own.",
    placement: "center",
  },
]

export default function TourBasicExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-center p-4">
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Start Tour
      </Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        mask={false}
        gap={{ offset: 10, radius: 8 }}
      />
    </div>
  )
}
