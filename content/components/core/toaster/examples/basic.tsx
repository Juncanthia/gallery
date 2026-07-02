import { Toaster } from "@/components/core/toaster"
import { Button } from "@/components/core/button"
export default function Tst() {
  return (
    <div>
      <Toaster />
      <Button size="small" variant="outlined">触发 Toast</Button>
    </div>
  )
}
