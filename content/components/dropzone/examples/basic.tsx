import { useState } from "react"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/dropzone"

export default function DropzoneBasicExample() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <Dropzone
      src={files}
      accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
      maxSize={5 * 1024 * 1024}
      onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
    >
      <DropzoneContent />
      <DropzoneEmptyState />
    </Dropzone>
  )
}
