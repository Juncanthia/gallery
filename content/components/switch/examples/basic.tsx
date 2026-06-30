import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function SwitchBasicExample() {
  const [on, setOn] = useState(true)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Switch checked={on} onChange={setOn} />
      <Switch defaultChecked />
      <Switch disabled />
      <Switch defaultChecked disabled />
      <Switch size="small" />
      <Switch loading />
    </div>
  )
}
