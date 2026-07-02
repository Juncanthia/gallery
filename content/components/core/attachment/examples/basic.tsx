import { FileIcon, X } from "lucide-react"
import {
  Attachment, AttachmentActions, AttachmentContent,
  AttachmentDescription, AttachmentMedia, AttachmentTitle,
} from "@/components/core/attachment"
import { Button } from "@/components/core/button"

export default function AttachmentBasicExample() {
  return (
    <div className="space-y-2">
      <Attachment>
        <AttachmentMedia>
          <FileIcon className="size-4" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>document.pdf</AttachmentTitle>
          <AttachmentDescription>2.3 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Button size="small" variant="text" icon={<X className="size-3.5" />} aria-label="移除" />
        </AttachmentActions>
      </Attachment>

      <Attachment state="uploading">
        <AttachmentMedia>
          <FileIcon className="size-4" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>image.png</AttachmentTitle>
          <AttachmentDescription>上传中...</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    </div>
  )
}
