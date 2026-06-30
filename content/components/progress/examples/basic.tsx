import { Progress } from "@/components/ui/progress"

export default function ProgressBasicExample() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Progress value={30} />
      <Progress value={60} />
      <Progress value={100} />
      <Progress value={75} />
    </div>
  )
}
