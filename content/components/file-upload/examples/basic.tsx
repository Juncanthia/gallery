import { useState } from "react"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
  FileUploadClear,
} from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

export default function FileUploadBasicExample() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <FileUpload
      className="w-full max-w-md"
      value={files}
      onValueChange={setFiles}
      accept="image/*,.pdf"
      maxFiles={5}
      maxSize={5 * 1024 * 1024}
      multiple
      onFileReject={(file, message) => {
        console.log(`${file.name} 被拒绝：${message}`)
      }}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium">拖拽文件到此处，或点击选择</p>
          <p className="text-xs text-muted-foreground">
            支持图片和 PDF，单个文件不超过 5MB
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2">
            浏览文件
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file) => (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <XIcon />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
      <FileUploadClear asChild>
        <Button variant="outline" size="sm">
          清空全部
        </Button>
      </FileUploadClear>
    </FileUpload>
  )
}
