import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { FileIcon, UploadCloud, X } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/button"

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done"

type AttachmentFile = {
  uid: string
  name: string
  size?: number
  type?: string
  status?: AttachmentState
  url?: string
  thumbUrl?: string
  description?: React.ReactNode
  originFileObj?: File
}

type AttachmentUploadChangeInfo = {
  file: AttachmentFile
  fileList: AttachmentFile[]
}

type BeforeUploadResult =
  | boolean
  | void
  | File
  | Blob
  | AttachmentFile
  | Promise<boolean | void | File | Blob | AttachmentFile>

type AttachmentUploadProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "children"
> & {
  fileList?: AttachmentFile[]
  defaultFileList?: AttachmentFile[]
  onChange?: (info: AttachmentUploadChangeInfo) => void
  onRemove?: (file: AttachmentFile) => boolean | void | Promise<boolean | void>
  beforeUpload?: (file: File, fileList: File[]) => BeforeUploadResult
  accept?: string
  multiple?: boolean
  maxCount?: number
  disabled?: boolean
  drag?: boolean
  showList?: boolean
  showRemove?: boolean
  trigger?: React.ReactNode
  emptyText?: React.ReactNode
  renderItem?: (
    file: AttachmentFile,
    fileList: AttachmentFile[],
    actions: { remove: () => void },
  ) => React.ReactNode
  size?: VariantProps<typeof attachmentVariants>["size"]
  orientation?: VariantProps<typeof attachmentVariants>["orientation"]
}

function formatFileSize(size?: number) {
  if (typeof size !== "number") {
    return undefined
  }

  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function isAttachmentFile(value: unknown): value is AttachmentFile {
  return (
    typeof value === "object" &&
    value !== null &&
    "uid" in value &&
    "name" in value
  )
}

function createAttachmentFile(file: File | Blob, fallbackName: string): AttachmentFile {
  const name = "name" in file && typeof file.name === "string" ? file.name : fallbackName

  return {
    uid: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    size: file.size,
    type: file.type,
    status: "done",
    originFileObj: file instanceof File ? file : undefined,
  }
}

function limitFileList(fileList: AttachmentFile[], maxCount?: number) {
  if (!maxCount || maxCount < 1) {
    return fileList
  }

  if (maxCount === 1) {
    return fileList.slice(-1)
  }

  return fileList.slice(0, maxCount)
}

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
        sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
  }
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: AttachmentState
  }) {
  const resolvedOrientation = orientation ?? "horizontal"

  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={resolvedOrientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80",
        "max-w-full",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "small",
  shape = "square",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "text"}
      size={size}
      shape={shape}
      className={cn(className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="attachment-trigger"
      type={asChild ? undefined : (type ?? "button")}
      className={cn("absolute inset-0 z-10 outline-none", className)}
      {...props}
    />
  )
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className
      )}
      {...props}
    />
  )
}

function AttachmentUpload({
  className,
  fileList,
  defaultFileList = [],
  onChange,
  onRemove,
  beforeUpload,
  accept,
  multiple = false,
  maxCount,
  disabled = false,
  drag = false,
  showList = true,
  showRemove = true,
  trigger,
  emptyText = "No files selected",
  renderItem,
  size = "default",
  orientation = "horizontal",
  onDrop,
  onDragOver,
  onDragLeave,
  ...props
}: AttachmentUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [internalFileList, setInternalFileList] =
    React.useState<AttachmentFile[]>(defaultFileList)
  const [dragging, setDragging] = React.useState(false)
  const mergedFileList = fileList ?? internalFileList
  const isControlled = fileList !== undefined

  function triggerChange(changedFile: AttachmentFile, nextFileList: AttachmentFile[]) {
    if (!isControlled) {
      setInternalFileList(nextFileList)
    }

    onChange?.({
      file: changedFile,
      fileList: nextFileList,
    })
  }

  async function addFiles(nativeFiles: File[]) {
    if (disabled || nativeFiles.length === 0) {
      return
    }

    const selectedFiles = multiple ? nativeFiles : nativeFiles.slice(0, 1)
    const nextItems: AttachmentFile[] = []

    for (const nativeFile of selectedFiles) {
      const beforeResult = await beforeUpload?.(nativeFile, selectedFiles)

      if (beforeResult === false) {
        continue
      }

      if (isAttachmentFile(beforeResult)) {
        nextItems.push(beforeResult)
        continue
      }

      if (beforeResult instanceof Blob) {
        nextItems.push(createAttachmentFile(beforeResult, nativeFile.name))
        continue
      }

      nextItems.push(createAttachmentFile(nativeFile, nativeFile.name))
    }

    if (nextItems.length === 0) {
      return
    }

    const nextFileList = limitFileList([...mergedFileList, ...nextItems], maxCount)
    triggerChange(nextItems[nextItems.length - 1], nextFileList)
  }

  async function removeFile(file: AttachmentFile) {
    if (disabled) {
      return
    }

    const removeResult = await onRemove?.(file)

    if (removeResult === false) {
      return
    }

    const nextFileList = mergedFileList.filter((item) => item.uid !== file.uid)
    triggerChange({ ...file, status: "idle" }, nextFileList)
  }

  function openFileDialog() {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    void addFiles(Array.from(event.target.files ?? []))
    event.target.value = ""
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    onDrop?.(event)

    if (disabled || !drag) {
      return
    }

    event.preventDefault()
    setDragging(false)
    void addFiles(Array.from(event.dataTransfer.files))
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    onDragOver?.(event)

    if (disabled || !drag) {
      return
    }

    event.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    onDragLeave?.(event)

    if (!drag) {
      return
    }

    setDragging(false)
  }

  const defaultTrigger = drag ? (
    <div
      data-slot="attachment-upload-trigger"
      data-dragging={dragging || undefined}
      className={cn(
        "flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed px-4 py-5 text-center text-sm transition-colors",
        "hover:bg-muted/50 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5",
        disabled && "pointer-events-none opacity-50",
      )}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={openFileDialog}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          openFileDialog()
        }
      }}
    >
      <UploadCloud className="size-5 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground">
          {multiple ? "Multiple files supported" : "Single file"}
        </p>
      </div>
    </div>
  ) : (
    <Button htmlType="button" variant="outlined" disabled={disabled} onClick={openFileDialog}>
      <UploadCloud className="size-4" />
      Select file
    </Button>
  )

  return (
    <div
      data-slot="attachment-upload"
      data-disabled={disabled || undefined}
      className={cn("flex min-w-0 flex-col gap-3", className)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={handleInputChange}
      />

      {trigger ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          className={cn(
            "w-fit text-left",
            disabled && "pointer-events-none opacity-50",
          )}
          onClick={openFileDialog}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              openFileDialog()
            }
          }}
        >
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}

      {showList ? (
        mergedFileList.length > 0 ? (
          <AttachmentGroup>
            {mergedFileList.map((file) => {
              const remove = () => void removeFile(file)

              if (renderItem) {
                return (
                  <React.Fragment key={file.uid}>
                    {renderItem(file, mergedFileList, { remove })}
                  </React.Fragment>
                )
              }

              const description = file.description ?? formatFileSize(file.size)

              return (
                <Attachment
                  key={file.uid}
                  state={file.status ?? "done"}
                  size={size}
                  orientation={orientation}
                >
                  <AttachmentMedia variant={file.thumbUrl ? "image" : "icon"}>
                    {file.thumbUrl ? (
                      <img src={file.thumbUrl} alt="" />
                    ) : (
                      <FileIcon className="size-4" />
                    )}
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                    {description ? (
                      <AttachmentDescription>{description}</AttachmentDescription>
                    ) : null}
                  </AttachmentContent>
                  {showRemove ? (
                    <AttachmentActions>
                      <AttachmentAction
                        aria-label={`Remove ${file.name}`}
                        disabled={disabled}
                        onClick={remove}
                      >
                        <X className="size-3.5" />
                      </AttachmentAction>
                    </AttachmentActions>
                  ) : null}
                </Attachment>
              )
            })}
          </AttachmentGroup>
        ) : (
          <p className="text-xs text-muted-foreground">{emptyText}</p>
        )
      ) : null}
    </div>
  )
}

export {
  type AttachmentFile,
  type AttachmentUploadChangeInfo,
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
  AttachmentUpload,
}
