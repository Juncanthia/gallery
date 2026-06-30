"use client"

import React from "react"
import { DocxEditorPreview } from "@/components/ui/extend-docx-editor"

export default function Demo() {
  const [isDark, setIsDark] = React.useState(false)

  return (
    <DocxEditorPreview
      src="/samples/demo.docx"
      isDark={isDark}
      onIsDarkChange={setIsDark}
    />
  )
}
