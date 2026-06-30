"use client"

import { MessageDraft } from "@/components/ui/tool-message-draft"

export default function Demo() {
  return (
    <MessageDraft
      id="demo-email-draft"
      channel="email"
      subject="Q3 Product Roadmap Review"
      from="alice@company.com"
      to={["bob@company.com", "carol@company.com"]}
      cc={["team-leads@company.com"]}
      body={`Hi team,

I've put together the draft for our Q3 product roadmap. Key highlights:

1. User Dashboard Redesign — targeting mid-July
2. API v2 Migration — phased rollout starting August
3. Performance Optimization — ongoing throughout the quarter

Please review and share your feedback by Friday.

Best,
Alice`}
      onSend={() => console.log("Email sent")}
      onUndo={() => console.log("Send undone")}
      onCancel={() => console.log("Email cancelled")}
    />
  )
}
