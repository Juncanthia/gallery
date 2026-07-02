"use client"

import { QRCode as QRCodeBase, type QRCodeProps } from "@/components/blocks/qr-code"

function QRCode(props: QRCodeProps) {
  return (
    <div className="inline-flex rounded border bg-background p-2" data-slot="qrcode">
      <QRCodeBase {...props} />
    </div>
  )
}

export { QRCode }
export type { QRCodeProps }
