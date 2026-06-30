import {
  Dock,
  DockItem,
  DockDropdownItem,
  DockIcon,
  DockLink,
} from "@/components/ui/chamaac-dock"
import { Home, Settings, ExternalLink } from "lucide-react"

export default function Demo() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded border">
      <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
        Hover the dock items at bottom to see interactions
      </div>

      <Dock bottomOffset="20px">
        <DockLink label="Home" href="/" icon={<Home size={14} />} />

        <DockItem label="Products" id="products">
          <DockDropdownItem label="Analytics" href="/products/analytics" />
          <DockDropdownItem label="Engagement" href="/products/engagement" />
          <DockDropdownItem label="Security" href="/products/security" />
        </DockItem>

        <DockItem label="Resources" id="resources">
          <DockDropdownItem label="Documentation" href="/resources/docs" />
          <DockDropdownItem label="API Reference" href="/resources/api" />
          <DockDropdownItem label="Blog" href="/resources/blog" />
        </DockItem>

        <DockLink
          label="External"
          href="https://example.com"
          external
          icon={<ExternalLink size={14} />}
        />

        <DockIcon icon={<Settings size={18} />} href="/settings" />
      </Dock>
    </div>
  )
}
