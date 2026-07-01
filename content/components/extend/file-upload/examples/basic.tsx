import { FileUpload } from "@/components/ui/file-upload-extend"

export default function Demo() {
  return (
    <FileUpload
      className="w-full max-w-md"
      description="PDF, DOC/DOCX, XLSX, CSV, PNG, or JPG"
      multiple
      title="Click to upload or drop files"
      onFilesChange={(files) => {
        console.log("Files changed:", files)
      }}
    />
  )
}
