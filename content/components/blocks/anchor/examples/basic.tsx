import { useState } from "react"
import { Anchor } from "@/components/core/anchor"

export default function AnchorBasicExample() {
  const [active, setActive] = useState("about")

  return (
    <div className="flex gap-8">
      <Anchor
        items={[
          { key: "about", href: "#about", title: "关于" },
          { key: "features", href: "#features", title: "功能特性" },
          { key: "api", href: "#api", title: "API" },
          { key: "faq", href: "#faq", title: "常见问题" },
        ]}
        activeKey={active}
        onChange={setActive}
      />
    </div>
  )
}
