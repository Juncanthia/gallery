import { QRCode } from "@/components/ui/qr-code"

export default function QRCodeBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <QRCode data="https://example.com" />
      <QRCode data="https://example.com" className="size-20" />
    </div>
  )
}
