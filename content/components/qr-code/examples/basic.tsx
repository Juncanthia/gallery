import { QRCode } from "@/components/ui/qr-code"

export default function QRCodeBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <QRCode data="https://example.com" />
      <QRCode
        value="https://example.com/docs"
        foreground="#4f46e5"
        background="#eef2ff"
        level="H"
        size={120}
        overlay={<span className="px-1 text-xs font-medium">Docs</span>}
      />
    </div>
  )
}
