"use client"

import {
  Transfer as TransferBase,
  type TransferProps,
  type TransferItem,
} from "@/components/blocks/transfer"

function Transfer(props: TransferProps) {
  return <TransferBase {...props} />
}

export { Transfer }
export type { TransferProps, TransferItem }
