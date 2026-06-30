import { PDFViewer } from "@/components/ui/extend-pdf-viewer"

const SAMPLE_PDF =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

export default function Demo() {
  return (
    <div className="h-[600px] w-full">
      <PDFViewer src={SAMPLE_PDF} />
    </div>
  )
}
