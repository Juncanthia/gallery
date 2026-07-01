"use client"

import { Progress } from "@/components/ui/progress-dice"

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={0} />
      <Progress value={30} />
      <Progress value={60} />
      <Progress value={100} />
    </div>
  )
}
