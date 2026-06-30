import { useState } from "react"

import { Button } from "@/components/ui/button"

export default function ButtonLoadingExample() {
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => setSaving(false), 1500)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button color="primary" loading variant="solid">
        Loading
      </Button>
      <Button color="primary" loading loadingText="提交中" variant="outlined">
        提交
      </Button>
      <Button
        color="primary"
        loading={saving}
        loadingText="保存中"
        onClick={handleSave}
        variant="solid"
      >
        保存
      </Button>
    </div>
  )
}
