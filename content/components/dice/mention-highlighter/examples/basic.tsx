"use client"

import { MentionHighlighter } from "@/components/data-entry/dice/mention/mention-highlighter"
import { MentionRoot } from "@/components/data-entry/dice/mention/mention-root"
import { MentionInput } from "@/components/data-entry/dice/mention/mention-input"
import { MentionContent } from "@/components/data-entry/dice/mention/mention-content"
import { MentionItem } from "@/components/data-entry/dice/mention/mention-item"
import { MentionPortal } from "@/components/data-entry/dice/mention/mention-portal"

export default function Demo() {
  return (
    <MentionRoot className="w-80">
      <MentionInput
        placeholder="输入 @ 提及用户..."
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
      <MentionPortal>
        <MentionContent className="rounded-md border bg-popover p-1 shadow-md">
          <MentionItem value="zhangsan" label="张三" className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent" />
          <MentionItem value="lisi" label="李四" className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent" />
          <MentionItem value="wangwu" label="王五" className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent" />
        </MentionContent>
      </MentionPortal>
    </MentionRoot>
  )
}
