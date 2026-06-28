import { useState } from "react";
import { GallerySection, DemoRow, SectionGroup } from "../gallery-section";
import { Button } from "@/components/base/button";
import { Label } from "@/components/base/label";
import { Switch } from "@/components/base/switch";
import { Tabs } from "@/components/base/tabs";
import { Menubar } from "@/components/base/menubar";
import { NavigationMenu } from "@/components/base/navigation-menu";
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
  ChevronDown, Copy, Trash2, FolderOpen, FileText, Shield,
} from "lucide-react";

export function InteractiveSection() {
  const [progress, setProgress] = useState(40);
  const [darkMode, setDarkMode] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [notifChecked, setNotifChecked] = useState({ status: true, badge: false });
  const [paginationPage, setPaginationPage] = useState(2);
  const [menuKeys, setMenuKeys] = useState<string[]>(["projects"]);
  const [navKeys, setNavKeys] = useState<string[]>(["overview"]);

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
              centered
              tabBarExtraContent={{ right: <Button size="small" variant="outlined">Export</Button> }}
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
              tabBarGutter={6}
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

        <GallerySection id="menubar" title="Menubar" description="Desktop application menu with AntD-like items API.">
          <DemoRow label="Items API">
            <div className="w-full max-w-2xl space-y-3">
              <Menubar
                selectedKeys={menuKeys}
                onSelect={({ selectedKeys }) => setMenuKeys(selectedKeys.map(String))}
                items={[
                  {
                    key: "file",
                    type: "submenu",
                    label: "File",
                    children: [
                      { key: "new", label: "New File", icon: <FileText className="size-4" />, shortcut: "⌘N" },
                      { key: "open", label: "Open Folder", icon: <FolderOpen className="size-4" />, shortcut: "⌘O" },
                      { type: "divider" },
                      { key: "settings", label: "Settings", icon: <Settings className="size-4" />, extra: "⌘," },
                    ],
                  },
                  {
                    key: "projects",
                    label: "Projects",
                    icon: <FolderOpen className="size-4" />,
                  },
                  {
                    key: "view",
                    type: "submenu",
                    label: "View",
                    children: [
                      {
                        key: "layout",
                        type: "group",
                        label: "Layout",
                        children: [
                          { key: "sidebar", label: "Show Sidebar", shortcut: "⌘B" },
                          { key: "panel", label: "Toggle Panel", shortcut: "⌘J" },
                        ],
                      },
                    ],
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    icon: <Trash2 className="size-4" />,
                    danger: true,
                  },
                ]}
              />
              <p className="text-xs text-muted-foreground">Selected: {menuKeys.join(", ")}</p>
            </div>
          </DemoRow>
        </GallerySection>

        <GallerySection id="navigation-menu" title="Navigation Menu" description="Site navigation with link panels and selected key state.">
          <DemoRow label="Items API">
            <div className="w-full max-w-2xl space-y-3">
              <NavigationMenu
                selectedKeys={navKeys}
                onSelect={({ selectedKeys }) => setNavKeys(selectedKeys.map(String))}
                items={[
                  {
                    key: "overview",
                    label: "Overview",
                    icon: <Info className="size-4" />,
                  },
                  {
                    key: "products",
                    label: "Products",
                    icon: <FolderOpen className="size-4" />,
                    children: [
                      {
                        key: "core",
                        label: "Core Platform",
                        icon: <Settings className="size-4" />,
                        extra: "New",
                        description: "Manage application settings, teams, and permissions.",
                      },
                      {
                        key: "security",
                        label: "Security Center",
                        icon: <Shield className="size-4" />,
                        description: "Audit access, policies, and sensitive operations.",
                      },
                      { type: "divider" },
                      {
                        key: "docs",
                        label: "Documentation",
                        icon: <FileText className="size-4" />,
                        description: "Read implementation guides and API references.",
                      },
                    ],
                  },
                  {
                    key: "billing",
                    label: "Billing",
                    icon: <CreditCard className="size-4" />,
                    extra: "2",
                  },
                  {
                    key: "disabled",
                    label: "Disabled",
                    disabled: true,
                  },
                ]}
              />
              <p className="text-xs text-muted-foreground">Selected: {navKeys.join(", ")}</p>
            </div>
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
          <DemoRow label="Trigger area / custom icon">
            <Accordion
              defaultActiveKey={["metrics"]}
              collapsible="icon"
              expandIcon={({ isActive }) => (
                <ChevronDown className={`size-4 transition-transform ${isActive ? "rotate-180" : ""}`} />
              )}
              className="w-full max-w-md"
              items={[
                {
                  key: "metrics",
                  label: "Only the icon toggles this panel",
                  forceRender: true,
                  extra: <Button size="small" variant="text">Action</Button>,
                  children: "The content stays mounted with forceRender while the panel is hidden.",
                },
                {
                  key: "locked",
                  label: "Disabled by collapsible",
                  collapsible: "disabled",
                  children: "This panel cannot be toggled.",
                },
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
            <Breadcrumb
              routes={[
                { breadcrumbName: "Home", path: "home" },
                {
                  breadcrumbName: "Projects",
                  path: "projects",
                  menu: {
                    items: [
                      { label: "Active projects", path: "active" },
                      { label: "Archived projects", path: "archived" },
                    ],
                  },
                },
                { breadcrumbName: "Detail", path: ":id" },
              ]}
              params={{ id: 42 }}
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
          <DemoRow label="Changer / jumper">
            <div className="flex w-full max-w-2xl flex-col gap-3">
              <Pagination
                align="end"
                defaultCurrent={3}
                total={286}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[10, 20, 50]}
                showTotal={(total) => `${total} items`}
              />
            </div>
          </DemoRow>
        </GallerySection>

        <GallerySection id="collapsible" title="Collapsible" description="Single collapsible block with an API-first header.">
          <DemoRow label="API">
            <Collapsible
              title="Dependencies"
              defaultOpen
              className="w-64"
              collapsible="icon"
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
              width={460}
              maskClosable={false}
              okButtonProps={{ color: "primary" }}
              cancelButtonProps={{ variant: "outlined" }}
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
              confirmLoading={false}
              okButtonProps={{ color: "danger", variant: "solid" }}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="sheet" title="Sheet" description="Slide-in side panel.">
          <DemoRow label="API">
            {(["left", "right", "top", "bottom"] as const).map((side) => (
              <Sheet
                key={side}
                placement={side}
                size={side === "left" || side === "right" ? "default" : 280}
                trigger={<Button variant="outlined" className="capitalize">{side}</Button>}
                title={`Settings (${side})`}
                description="Configure your preferences in this side panel."
                extra={<Button size="small" variant="outlined">Reset</Button>}
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
              placement="right"
              size="default"
              extra={<Button size="small">Done</Button>}
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
              placement="bottomRight"
              contentProps={{ className: "w-52" }}
              menu={{ items: [
                { type: "label", label: "My Account" },
                { type: "separator" },
                { label: "Profile", icon: <User className="size-4" />, extra: "⇧⌘P" },
                { label: "Billing", icon: <CreditCard className="size-4" />, shortcut: "⌘B" },
                { label: "Settings", icon: <Settings className="size-4" /> },
                { type: "separator" },
                { label: "Log out", icon: <LogOut className="size-4" />, danger: true },
              ]}}
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
                { label: "Copy", icon: <Copy className="size-4" />, extra: "⌘C" },
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
              title="Quick Actions"
              placement="topLeft"
              arrow
              contentProps={{ className: "w-60" }}
              content={
                <div className="space-y-2">
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
            <Tooltip title="Confirm selection" placement="top" arrow>
              <Button variant="outlined" shape="square"><Check className="size-4" /></Button>
            </Tooltip>
            <Tooltip title="More information" placement="bottom" arrow>
              <Button variant="outlined" shape="square"><Info className="size-4" /></Button>
            </Tooltip>
            <Tooltip title="Open settings" placement="right" color="#2563eb" arrow>
              <Button variant="outlined" shape="square"><Settings className="size-4" /></Button>
            </Tooltip>
            <Tooltip title="Notifications" placement="left" color="#f59e0b" arrow>
              <Button variant="outlined" shape="square"><Bell className="size-4" /></Button>
            </Tooltip>
          </DemoRow>
        </GallerySection>

        <GallerySection id="hover-card" title="Hover Card" description="Rich preview on hover.">
          <DemoRow label="API">
            <HoverCard
              trigger={<Button variant="link" className="h-auto p-0 text-base">@acme_corp</Button>}
              placement="rightTop"
              arrow
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
              <Progress
                percent={progress}
                showInfo
                percentPosition={{ type: "inner", align: "end" }}
                strokeColor={{ from: "#6366f1", to: "#22c55e" }}
                success={{ percent: 25, strokeColor: "#22c55e" }}
              />
              <div className="flex gap-2 items-center">
                <Button size="small" variant="outlined" onClick={() => setProgress((p) => Math.max(0, p - 10))}>-10</Button>
                <Button size="small" variant="outlined" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10</Button>
                <span className="text-sm tabular-nums text-muted-foreground">{progress}%</span>
              </div>
            </div>
          </DemoRow>
          <DemoRow label="Circle / steps">
            <Progress type="circle" percent={progress} showInfo />
            <Progress type="dashboard" percent={72} showInfo status="active" />
            <div className="w-full max-w-sm space-y-3">
              <Progress steps={{ count: 8, gap: 6 }} percent={progress} showInfo />
              <Progress steps={5} percent={100} status="success" showInfo />
            </div>
          </DemoRow>
        </GallerySection>
      </SectionGroup>
    </TooltipProvider>
  );
}
