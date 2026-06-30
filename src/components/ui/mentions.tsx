"use client"

import {
  Mentions as MentionsBase,
  type MentionsProps,
  type MentionsOptionType,
} from "@/components/blocks/mentions"

function Mentions(props: MentionsProps) {
  return <MentionsBase {...props} />
}

export { Mentions }
export type { MentionsProps, MentionsOptionType }
