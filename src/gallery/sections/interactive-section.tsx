import { useState } from "react";
import { GallerySection, DemoRow, SectionGroup } from "../gallery-section";
import { Button } from "@/components/base/button";
import { Label } from "@/components/base/label";
import { Switch } from "@/components/base/switch";
import { Tabs } from "@/components/base/tabs";
import { Accordion } from "@/components/base/accordion";
import { Breadcrumb } from "@/components/base/breadcrumb";
import { Pagination } from "@/components/base/pagination";
import { Collapsible } from "@/components/base/collapsible";
import { Dialog } from "@/components/base/dialog";
import { AlertDialog } from "@/components/base/alert-dialog";
import { Sheet } from "@/components/base/sheet";
import { Drawer } from "@/components/base/drawer";
import { DropdownMenu } from "@/components/base/dropdown-menu";
import { ContextMenu } from "@/components/base/context-menu";
import { Popover } from "@/components/base/popover";
import { TooltipProvider, Tooltip } from "@/components/base/tooltip";
import { HoverCard } from "@/components/base/hover-card";
import { Progress } from "@/components/base/progress";
import { Avatar, AvatarFallback } from "@/components/base/avatar";
import {
  User, Settings, Bell, LogOut, CreditCard, Check, Info,
  ChevronDown, Copy, Trash2,
} from "lucide-react";

export function InteractiveSection() {
  const [progress, setProgress] = useState(40);
  const [darkMode, setDarkMode] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [notifChecked, setNotifChecked] = useState({ status: true, badge: false });
  const [paginationPage, setPaginationPage] = useState(2);

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDarkMode((v) => !v);
  }

  return (
    <TooltipProvider>
      <SectionGroup title="Navigation" description="Wayfinding and structural navigation components.">
        <GallerySection id="tabs" title="Tabs" description="Tabbed content panels.">
          <DemoRow label="Items API">
            <Tabs
              defaultActiveKey="overview"
              className="w-full max-w-md"
              items={[
                {
                  key: "overview",
                  label: "Overview",
                  children: <p className="pt-3 text-sm text-muted-foreground">Overview of your project metrics and recent activity.</p>,
                },
                {
                  key: "analytics",
                  label: "Analytics",
                  children: <p className="pt-3 text-sm text-muted-foreground">Detailed analytics including traffic and conversion data.</p>,
                },
                {
                  key: "reports",
                  label: "Reports",
                  children: <p className="pt-3 text-sm text-muted-foreground">Downloadable reports for the selected time period.</p>,
                },
              ]}
            />
          </DemoRow>
          <DemoRow label="Card / disabled">
            <Tabs
              type="card"
              size="small"
              defaultActiveKey="account"
              className="w-full max-w-md"
              items={[
                { key: "account", label: "Account", icon: <User className="size-3.5" />, children: <p className="pt-3 text-sm text-muted-foreground">Account settings.</p> },
                { key: "security", label: "Security", icon: <Settings className="size-3.5" />, children: <p className="pt-3 text-sm text-muted-foreground">Security preferences.</p> },
                { key: "billing", label: "Billing", icon: <CreditCard className="size-3.5" />, disabled: true, children: <p className="pt-3 text-sm text-muted-foreground">Billing is disabled.</p> },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="accordion" title="Accordion" description="Collapsible content sections — height animates with motion.">
          <DemoRow label="Items API">
            <Accordion
              accordion
              defaultActiveKey="q1"
              className="w-full max-w-md"
              items={[
                {
                  key: "q1",
                  label: "Is it accessible?",
                  children: "Built on Radix UI — fully keyboard-navigable and ARIA-compliant.",
                },
                {
                  key: "q2",
                  label: "Can I open multiple?",
                  children: <>Use <code className="rounded bg-muted px-1 text-xs">accordion={false}</code> to allow multiple open items.</>,
                },
                {
                  key: "q3",
                  label: "Is it animated?",
                  extra: "motion",
                  children: "Yes — content slides with a smooth height transition.",
                },
              ]}
            />
          </DemoRow>
          <DemoRow label="Ghost / no arrow">
            <Accordion
              ghost
              expandIconPlacement="start"
              defaultActiveKey={["deploy"]}
              className="w-full max-w-md"
              items={[
                { key: "deploy", label: "Deploy preview", children: "Preview deployment is ready." },
                { key: "logs", label: "Build logs", showArrow: false, children: "No arrow for this panel." },
                { key: "disabled", label: "Disabled", disabled: true, children: "Disabled content." },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="breadcrumb" title="Breadcrumb" description="Navigation location trail.">
          <DemoRow label="Items API">
            <Breadcrumb
              items={[
                { title: "Home", href: "/" },
                { title: "Components", href: "/components" },
                { title: "Breadcrumb" },
              ]}
            />
          </DemoRow>
          <DemoRow label="Separator / params">
            <Breadcrumb
              separator=">"
              params={{ id: 42 }}
              items={[
                { title: "Projects", path: "projects" },
                { title: "Project :id", path: ":id" },
                { type: "separator", separator: "…" },
                { title: "Settings" },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="pagination" title="Pagination" description="Page navigation controls.">
          <DemoRow label="Controlled">
            <div className="flex w-full max-w-2xl flex-col gap-3">
              <Pagination
                current={paginationPage}
                total={186}
                pageSize={10}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
                onChange={(page) => setPaginationPage(page)}
              />
              <p className="text-xs text-muted-foreground text-center">Current page: <strong>{paginationPage}</strong></p>
            </div>
          </DemoRow>
          <DemoRow label="Variants">
            <Pagination defaultCurrent={6} total={120} showLessItems size="small" />
            <Pagination simple defaultCurrent={3} total={80} />
            <Pagination disabled defaultCurrent={4} total={80} />
          </DemoRow>
        </GallerySection>

        <GallerySection id="collapsible" title="Collapsible" description="Single collapsible block with an API-first header.">
          <DemoRow label="API">
            <Collapsible
              title="Dependencies"
              defaultOpen
              className="w-64"
              extra={<span className="text-xs text-muted-foreground">4 deps</span>}
            >
              <div className="space-y-1">
                {["react", "vite", "tailwindcss", "typescript"].map((dep) => (
                  <div key={dep} className="rounded border bg-background px-3 py-1.5 font-mono">
                    {dep}
                  </div>
                ))}
              </div>
            </Collapsible>
          </DemoRow>
        </GallerySection>
      </SectionGroup>

      <SectionGroup title="Overlay" description="Modals, panels, menus, and floating UI elements.">
        <GallerySection id="dialog" title="Dialog" description="Modal overlay with focus trap.">
          <DemoRow label="API">
            <Dialog
              trigger={<Button variant="outlined">Open Dialog</Button>}
              title="Edit Profile"
              description="Make changes to your profile here."
              cancelText="Cancel"
              okText="Save changes"
              contentProps={{ className: "sm:max-w-md" }}
            >
              <div className="grid gap-3 py-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dlg-name">Name</Label>
                  <input id="dlg-name" defaultValue="Acme Corp" className="rounded border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dlg-email">Email</Label>
                  <input id="dlg-email" type="email" defaultValue="acme@example.com" className="rounded border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </Dialog>
          </DemoRow>
        </GallerySection>

        <GallerySection id="alert-dialog" title="Alert Dialog" description="Confirmation dialog requiring explicit user action.">
          <DemoRow label="API">
            <AlertDialog
              trigger={<Button color="danger" variant="solid">Delete Account</Button>}
              title="Are you absolutely sure?"
              description="This action cannot be undone. Your account will be permanently deleted."
              cancelText="Cancel"
              okText="Continue"
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="sheet" title="Sheet" description="Slide-in side panel.">
          <DemoRow label="API">
            {(["left", "right", "top", "bottom"] as const).map((side) => (
              <Sheet
                key={side}
                side={side}
                trigger={<Button variant="outlined" className="capitalize">{side}</Button>}
                title={`Settings (${side})`}
                description="Configure your preferences in this side panel."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Dark Mode</Label>
                    <Switch checked={darkMode} onCheckedChange={toggleDark} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Notifications</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Sheet>
            ))}
          </DemoRow>
        </GallerySection>

        <GallerySection id="drawer" title="Drawer" description="Bottom sheet drawer (mobile-friendly).">
          <DemoRow label="API">
            <Drawer
              trigger={<Button variant="outlined">Open Drawer</Button>}
              title="Quick Actions"
              description="Select an action to perform."
              closeText="Cancel"
            >
              <div className="flex flex-col gap-2">
                <Button variant="outlined" className="justify-start gap-2"><Copy className="size-4" /> Duplicate</Button>
                <Button variant="outlined" className="justify-start gap-2"><Settings className="size-4" /> Settings</Button>
                <Button color="danger" variant="solid" className="justify-start gap-2"><Trash2 className="size-4" /> Delete</Button>
              </div>
            </Drawer>
          </DemoRow>
        </GallerySection>

        <GallerySection id="dropdown" title="Dropdown Menu" description="Contextual action menus.">
          <DemoRow label="Items API">
            <DropdownMenu
              trigger={<Button variant="outlined"><User className="size-4" /> My Account <ChevronDown className="ml-1 size-3" /></Button>}
              contentProps={{ className: "w-52" }}
              items={[
                { type: "label", label: "My Account" },
                { type: "separator" },
                { label: "Profile", icon: <User className="size-4" />, shortcut: "⇧⌘P" },
                { label: "Billing", icon: <CreditCard className="size-4" />, shortcut: "⌘B" },
                { label: "Settings", icon: <Settings className="size-4" /> },
                { type: "separator" },
                { label: "Log out", icon: <LogOut className="size-4" />, danger: true },
              ]}
            />

            <DropdownMenu
              trigger={<Button variant="outlined"><Bell className="size-4" /> Notifications</Button>}
              contentProps={{ className: "w-52" }}
              items={[
                { type: "label", label: "Preferences" },
                { type: "separator" },
                {
                  type: "checkbox",
                  label: "Status Updates",
                  checked: notifChecked.status,
                  onCheckedChange: (v) => setNotifChecked((s) => ({ ...s, status: !!v })),
                },
                {
                  type: "checkbox",
                  label: "Badge Alerts",
                  checked: notifChecked.badge,
                  onCheckedChange: (v) => setNotifChecked((s) => ({ ...s, badge: !!v })),
                },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="context-menu" title="Context Menu" description="Right-click contextual actions.">
          <DemoRow label="Items API">
            <ContextMenu
              trigger={
                <div className="flex h-24 w-72 cursor-context-menu select-none items-center justify-center rounded border-2 border-dashed text-sm text-muted-foreground">
                  Right-click here
                </div>
              }
              contentProps={{ className: "w-52" }}
              items={[
                { type: "label", label: "Actions" },
                { type: "separator" },
                { label: "Copy", icon: <Copy className="size-4" />, shortcut: "⌘C" },
                { label: "Rename", icon: <Settings className="size-4" /> },
                { type: "checkbox", label: "Show hidden", checked: true },
                { type: "separator" },
                { label: "Delete", icon: <Trash2 className="size-4" />, danger: true },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="popover" title="Popover" description="Floating content panels.">
          <DemoRow label="API">
            <Popover
              trigger={<Button variant="outlined">Open Popover</Button>}
              contentProps={{ className: "w-60" }}
              content={
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quick Actions</p>
                  <p className="text-xs text-muted-foreground">Choose an action to perform.</p>
                  <div className="flex gap-2 pt-1">
                    <Button size="small" variant="outlined" className="flex-1">Cancel</Button>
                    <Button size="small" className="flex-1">Apply</Button>
                  </div>
                </div>
              }
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="tooltip" title="Tooltip" description="Short contextual hints on hover.">
          <DemoRow label="API">
            <Tooltip title="Confirm selection">
              <Button variant="outlined" shape="square"><Check className="size-4" /></Button>
            </Tooltip>
            <Tooltip title="More information" contentProps={{ side: "bottom" }}>
              <Button variant="outlined" shape="square"><Info className="size-4" /></Button>
            </Tooltip>
            <Tooltip title="Open settings" contentProps={{ side: "right" }}>
              <Button variant="outlined" shape="square"><Settings className="size-4" /></Button>
            </Tooltip>
            <Tooltip title="Notifications" contentProps={{ side: "left" }}>
              <Button variant="outlined" shape="square"><Bell className="size-4" /></Button>
            </Tooltip>
          </DemoRow>
        </GallerySection>

        <GallerySection id="hover-card" title="Hover Card" description="Rich preview on hover.">
          <DemoRow label="API">
            <HoverCard
              trigger={<Button variant="link" className="h-auto p-0 text-base">@acme_corp</Button>}
              contentProps={{ className: "w-72" }}
              content={
                <div className="flex gap-3">
                  <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">Acme Corp</p>
                    <p className="text-xs text-muted-foreground">Building the future, one component at a time.</p>
                    <p className="text-xs text-muted-foreground mt-1">Joined June 2024</p>
                  </div>
                </div>
              }
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="progress" title="Progress" description="Visual completion indicators — bar animates with spring physics.">
          <DemoRow label="Sizes">
            <div className="w-full max-w-md space-y-3">
              <Progress percent={progress} size="small" />
              <Progress percent={progress} showInfo />
              <Progress percent={progress} size="large" status={progress >= 80 ? "success" : "active"} />
              <div className="flex gap-2 items-center">
                <Button size="small" variant="outlined" onClick={() => setProgress((p) => Math.max(0, p - 10))}>-10</Button>
                <Button size="small" variant="outlined" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10</Button>
                <span className="text-sm tabular-nums text-muted-foreground">{progress}%</span>
              </div>
            </div>
          </DemoRow>
        </GallerySection>
      </SectionGroup>
    </TooltipProvider>
  );
}
