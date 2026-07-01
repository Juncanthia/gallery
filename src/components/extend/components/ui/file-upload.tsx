"use client"

import * as React from "react"
import {
  FileImageIcon,
  FileSpreadsheetIcon,
  FileUploadIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { BorderBeam } from "border-beam"

import { cn } from "@/components/extend/lib/utils"
import { Card } from "@/components/ui/card"
import { FileThumbnail } from "@/components/extend/components/ui/file-thumbnail"
import {
  FileUpload as FileUploadPrimitive,
  FileUploadDropzone,
  useFileUpload,
} from "@/components/ui/file-upload"

/**
 * This is a fully-styled preset built on top of the headless `FileUpload`
 * primitive (`@/components/ui/file-upload`). It reuses the primitive's
 * drag/drop state machine, click-to-browse wiring, keyboard support, and
 * validation pipeline, while keeping its own business-specific visuals
 * (icon cluster, `BorderBeam`, thumbnail file list) and "replace on each
 * drop" file-list semantics.
 */

type FileUploadItem = {
  id: string
  name: string
  type: string
  size: number
  url: string
}

type AcceptedFileType = {
  label: string
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
}

type FileUploadProps = {
  accept?: string
  acceptedFileTypes?: AcceptedFileType[]
  borderBeamTheme?: React.ComponentProps<typeof BorderBeam>["theme"]
  browseLabel?: string
  className?: string
  description?: string
  draggingLabel?: string
  multiple?: boolean
  showBorderBeam?: boolean
  showFileList?: boolean
  title?: string
  onFilesAccepted?: (files: File[]) => void
  onFilesChange?: (files: FileUploadItem[]) => void
}

const ACCEPTED_FILE_TYPES: AcceptedFileType[] = [
  { label: "Image", icon: FileImageIcon },
  { label: "PDF", icon: FileUploadIcon },
  { label: "Sheet", icon: FileSpreadsheetIcon },
]
const DEFAULT_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  ".xlsx",
  ".csv",
  ".png",
  ".jpg",
  ".jpeg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/png",
  "image/jpeg",
].join(",")
const ICON_TRANSFORMS = [
  {
    idle: "translate(-78%, -50%) rotate(-8deg)",
    active: "translate(-114%, -50%) rotate(-12deg) scale(1.08)",
  },
  {
    idle: "translate(-50%, -50%) rotate(0deg)",
    active: "translate(-50%, -50%) rotate(0deg) scale(1.18)",
  },
  {
    idle: "translate(-22%, -50%) rotate(8deg)",
    active: "translate(14%, -50%) rotate(12deg) scale(1.08)",
  },
]
const REJECTION_MESSAGE = "This file type is not supported here."

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"

  const units = ["B", "KB", "MB", "GB"]
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true

  return accept.split(",").some((rawToken) => {
    const token = rawToken.trim().toLowerCase()

    if (!token) return false
    if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token)
    if (token.endsWith("/*")) {
      return file.type.toLowerCase().startsWith(token.slice(0, -1))
    }

    return file.type.toLowerCase() === token
  })
}

function toUploadItems(files: File[]): FileUploadItem[] {
  return files.map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    type: file.type || "Unknown type",
    size: file.size,
    url: URL.createObjectURL(file),
  }))
}

function UploadIconCluster({
  acceptedFileTypes,
  isDragging,
}: {
  acceptedFileTypes: AcceptedFileType[]
  isDragging: boolean
}) {
  const singleIcon = acceptedFileTypes.length === 1

  return (
    <div className="relative h-14 w-36">
      {acceptedFileTypes.map((item, index) => (
        <Card
          key={item.label}
          className={cn(
            "absolute top-1/2 left-1/2 grid size-12 place-items-center rounded-xl bg-background text-muted-foreground transition-[transform,color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] before:rounded-[calc(var(--radius-xl)-1px)]",
            "motion-reduce:transition-none",
            index === 1 && "z-10",
            isDragging &&
              "bg-popover text-foreground shadow-md shadow-black/10 not-dark:bg-clip-border dark:shadow-black/25"
          )}
          style={{
            transform: singleIcon
              ? `translate(-50%, -50%) scale(${isDragging ? 1.14 : 1})`
              : isDragging
                ? ICON_TRANSFORMS[index]?.active
                : ICON_TRANSFORMS[index]?.idle,
          }}
        >
          <HugeiconsIcon icon={item.icon} className="size-5" />
        </Card>
      ))}
    </div>
  )
}

function FileUploadVisual({
  acceptedFileTypes,
  borderBeamTheme,
  browseLabel,
  description,
  draggingLabel,
  rejectionMessage,
  showBorderBeam,
  title,
}: {
  acceptedFileTypes: AcceptedFileType[]
  borderBeamTheme?: React.ComponentProps<typeof BorderBeam>["theme"]
  browseLabel: string
  description: string
  draggingLabel: string
  rejectionMessage: string | null
  showBorderBeam: boolean
  title: string
}) {
  const isDragging = useFileUpload((state) => state.dragOver)

  const dropzone = (
    <FileUploadDropzone
      className={cn(
        "relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-[1.125rem] border border-dashed bg-background px-6 py-10 text-center transition-[border-color,background-color] duration-200 ease-out",
        "motion-reduce:transition-none",
        isDragging
          ? "border-foreground/40 bg-accent/35"
          : "border-foreground/20 hover:border-foreground/35 hover:bg-muted/35 dark:border-foreground/25 dark:hover:border-foreground/40"
      )}
    >
      <UploadIconCluster
        acceptedFileTypes={acceptedFileTypes}
        isDragging={isDragging}
      />
      <div className="space-y-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        {rejectionMessage ? (
          <div className="text-xs text-destructive">{rejectionMessage}</div>
        ) : null}
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
        <HugeiconsIcon icon={Upload01Icon} className="size-3.5" />
        <span>{isDragging ? draggingLabel : browseLabel}</span>
      </div>
    </FileUploadDropzone>
  )

  if (!showBorderBeam) return dropzone

  return (
    <BorderBeam
      active={isDragging}
      borderRadius={18}
      brightness={2.4}
      className="rounded-[1.125rem]"
      colorVariant="ocean"
      duration={2.4}
      size="md"
      strength={1}
      theme={borderBeamTheme}
    >
      {dropzone}
    </BorderBeam>
  )
}

export function FileUpload({
  accept = DEFAULT_ACCEPT,
  acceptedFileTypes = ACCEPTED_FILE_TYPES,
  borderBeamTheme = "light",
  browseLabel = "Browse files",
  className,
  description = "PDF, DOC/DOCX, XLSX, CSV, PNG, or JPG",
  draggingLabel = "Drop to add",
  multiple = true,
  showBorderBeam = true,
  showFileList = true,
  title = "Click to upload or drop files",
  onFilesAccepted,
  onFilesChange,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<FileUploadItem[]>([])
  const [rejectionMessage, setRejectionMessage] = React.useState<
    string | null
  >(null)

  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.url))
    }
  }, [files])

  // Unlike the primitive's own store (which accumulates files across
  // drops), this preset replaces the whole list on every accepted batch -
  // matching the original single-shot "preview the latest drop" behavior.
  const handleAccept = React.useCallback(
    (acceptedFiles: File[]) => {
      const finalFiles = multiple ? acceptedFiles : acceptedFiles.slice(0, 1)

      setRejectionMessage(null)
      onFilesAccepted?.(finalFiles)

      const items = toUploadItems(finalFiles)
      setFiles((previousFiles) => {
        previousFiles.forEach((file) => URL.revokeObjectURL(file.url))
        return items
      })
      onFilesChange?.(items)
    },
    [multiple, onFilesAccepted, onFilesChange]
  )

  const handleFileValidate = React.useCallback(
    (file: File) => (matchesAccept(file, accept) ? null : REJECTION_MESSAGE),
    [accept]
  )

  const handleFileReject = React.useCallback((_file: File, message: string) => {
    setRejectionMessage(message)
  }, [])

  return (
    <FileUploadPrimitive
      accept={accept}
      multiple={multiple}
      onAccept={handleAccept}
      onFileReject={handleFileReject}
      onFileValidate={handleFileValidate}
      className={cn("gap-3", className)}
    >
      <FileUploadVisual
        acceptedFileTypes={acceptedFileTypes}
        borderBeamTheme={borderBeamTheme}
        browseLabel={browseLabel}
        description={description}
        draggingLabel={draggingLabel}
        rejectionMessage={rejectionMessage}
        showBorderBeam={showBorderBeam}
        title={title}
      />
      {showFileList && files.length > 0 ? (
        <div className="rounded-xl border bg-background">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0"
            >
              <FileThumbnail
                file={{
                  name: file.name,
                  type: file.type,
                }}
                previewImageUrl={
                  file.type.startsWith("image/") ? file.url : null
                }
                className="size-10 shrink-0 rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {file.type} - {formatBytes(file.size)}
                </div>
              </div>
              <div className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                Ready
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </FileUploadPrimitive>
  )
}
