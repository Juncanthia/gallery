import { useState } from "react"

import { LegacySwitch } from "@/components/_shared/sabraman"

export default function Demo() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <LegacySwitch
          checked={checked}
          onCheckedChange={setChecked}
          id="controlled"
        />
        <label htmlFor="controlled" className="text-sm select-none">
          {checked ? "已开启" : "已关闭"}
        </label>
      </div>

      <div className="flex items-center gap-3">
        <LegacySwitch defaultChecked id="uncontrolled" />
        <label htmlFor="uncontrolled" className="text-sm select-none">
          默认开启
        </label>
      </div>

      <div className="flex items-center gap-3">
        <LegacySwitch
          offLabel="关"
          onLabel="开"
          id="cn-label"
        />
        <label htmlFor="cn-label" className="text-sm select-none">
          自定义标签
        </label>
      </div>

      <div className="flex items-center gap-3">
        <LegacySwitch disabled id="disabled" />
        <label htmlFor="disabled" className="text-sm text-muted-foreground select-none">
          禁用状态
        </label>
      </div>
    </div>
  )
}
