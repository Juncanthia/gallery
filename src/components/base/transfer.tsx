"use client"

import {
  Transfer as TransferBase,
  type TransferProps,
  type TransferItem,
} from "@/components/composite/transfer"

function Transfer(props: TransferProps) {
  return <TransferBase {...props} />
}

export { Transfer }
export type { TransferProps, TransferItem }
