"use client"

import { useState } from "react"
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxIndicator,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
  ChoiceboxItemSubtitle,
} from "@/components/ui/choicebox"

export default function ChoiceboxBasicExample() {
  const [plan, setPlan] = useState("pro")

  return (
    <Choicebox value={plan} onValueChange={setPlan} className="w-full max-w-sm">
      <ChoiceboxItem value="starter" id="starter">
        <ChoiceboxIndicator />
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Starter</ChoiceboxItemTitle>
          <ChoiceboxItemSubtitle>$9 / month</ChoiceboxItemSubtitle>
        </ChoiceboxItemHeader>
      </ChoiceboxItem>
      <ChoiceboxItem value="pro" id="pro">
        <ChoiceboxIndicator />
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Pro</ChoiceboxItemTitle>
          <ChoiceboxItemSubtitle>$29 / month</ChoiceboxItemSubtitle>
        </ChoiceboxItemHeader>
      </ChoiceboxItem>
      <ChoiceboxItem value="enterprise" id="enterprise">
        <ChoiceboxIndicator />
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Enterprise</ChoiceboxItemTitle>
          <ChoiceboxItemSubtitle>Custom pricing</ChoiceboxItemSubtitle>
        </ChoiceboxItemHeader>
      </ChoiceboxItem>
    </Choicebox>
  )
}
