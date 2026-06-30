import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
export default function Tst() {
  return (
    <div>
      <Toaster />
      <Button size="small" variant="outlined">触发 Toast</Button>
    </div>
  )
}
