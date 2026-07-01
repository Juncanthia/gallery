import { FileSystemBlock, type FileSystemBlockProps } from "@/components/ui/file-system-block"

const SAMPLE_ITEMS: FileSystemBlockProps["items"] = [
  {
    kind: "folder",
    path: "documents/",
    name: "documents",
  },
  {
    kind: "folder",
    path: "images/",
    name: "images",
  },
  {
    kind: "file",
    path: "documents/report.pdf",
    name: "report.pdf",
    contentType: "application/pdf",
    size: 245000,
    updatedAt: "2026-06-15T10:30:00Z",
  },
  {
    kind: "file",
    path: "documents/invoice.docx",
    name: "invoice.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 128000,
    updatedAt: "2026-06-20T14:00:00Z",
  },
  {
    kind: "file",
    path: "documents/spreadsheet.xlsx",
    name: "spreadsheet.xlsx",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 89000,
    updatedAt: "2026-06-10T09:15:00Z",
  },
  {
    kind: "file",
    path: "images/screenshot.png",
    name: "screenshot.png",
    contentType: "image/png",
    size: 512000,
    updatedAt: "2026-06-25T16:45:00Z",
  },
  {
    kind: "file",
    path: "images/logo.svg",
    name: "logo.svg",
    contentType: "image/svg+xml",
    size: 3200,
    updatedAt: "2026-06-01T08:00:00Z",
  },
  {
    kind: "file",
    path: "readme.md",
    name: "readme.md",
    contentType: "text/markdown",
    size: 4500,
    updatedAt: "2026-06-30T12:00:00Z",
  },
]

export default function Demo() {
  return (
    <div className="w-full">
      <FileSystemBlock items={SAMPLE_ITEMS} title="My Files" />
    </div>
  )
}
