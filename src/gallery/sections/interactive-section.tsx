import { useState } from "react";
import { GallerySection, DemoRow, SectionGroup } from "../gallery-section";
import { Button } from "@/components/base/button";
import { Label } from "@/components/base/label";
import { Switch } from "@/components/base/switch";
import {
  Tabs, TabsList, TabsTrigger, TabsContents, TabsContent,
} from "@/components/base/tabs";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/base/accordion";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
} from "@/components/base/breadcrumb";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@/components/base/pagination";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/base/collapsible";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/base/dialog";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/base/alert-dialog";
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/base/sheet";
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerDescription, DrawerClose,
} from "@/components/base/drawer";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuShortcut, DropdownMenuCheckboxItem,
} from "@/components/base/dropdown-menu";
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuLabel, ContextMenuSeparator,
  ContextMenuShortcut, ContextMenuCheckboxItem,
} from "@/components/base/context-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/base/popover";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/base/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/base/hover-card";
import { Progress } from "@/components/base/progress";
import { Avatar, AvatarFallback } from "@/components/base/avatar";
import {
  User, Settings, Bell, LogOut, CreditCard, Check, Info,
  ChevronsUpDown, ChevronDown, Copy, Trash2,
} from "lucide-react";

export function InteractiveSection() {
  const [progress, setProgress] = useState(40);
  const [darkMode, setDarkMode] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  const [notifChecked, setNotifChecked] = useState({ status: true, badge: false });

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
    setDarkMode((v) => !v);
  }

  return (
    <TooltipProvider>
      <SectionGroup title="Navigation" description="Wayfinding and structural navigation components.">
        <GallerySection id="tabs" title="Tabs" description="Tabbed content panels.">
          <DemoRow label="Demo">
            <Tabs defaultValue="overview" className="w-full max-w-md">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContents>
                <TabsContent value="overview">
                  <p className="text-sm text-muted-foreground pt-3">Overview of your project metrics and recent activity.</p>
                </TabsContent>
                <TabsContent value="analytics">
                  <p className="text-sm text-muted-foreground pt-3">Detailed analytics including traffic and conversion data.</p>
                </TabsContent>
                <TabsContent value="reports">
                  <p className="text-sm text-muted-foreground pt-3">Downloadable reports for the selected time period.</p>
                </TabsContent>
              </TabsContents>
            </Tabs>
          </DemoRow>
        </GallerySection>

        <GallerySection id="accordion" title="Accordion" description="Collapsible content sections — height animates with motion.">
          <DemoRow label="FAQ">
            <div className="w-full max-w-md rounded-md border">
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger className="px-4">Is it accessible?</AccordionTrigger>
                  <AccordionContent className="px-4">
                    Built on Radix UI — fully keyboard-navigable and ARIA-compliant.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger className="px-4">Can I open multiple?</AccordionTrigger>
                  <AccordionContent className="px-4">
                    Use <code className="text-xs bg-muted px-1 rounded">type="multiple"</code> to allow multiple open items.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger className="px-4">Is it animated?</AccordionTrigger>
                  <AccordionContent className="px-4">
                    Yes — content slides with a smooth height transition.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DemoRow>
        </GallerySection>

        <GallerySection id="breadcrumb" title="Breadcrumb" description="Navigation location trail.">
          <DemoRow label="Default">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DemoRow>
          <DemoRow label="With ellipsis">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Gallery</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Current Page</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DemoRow>
        </GallerySection>

        <GallerySection id="pagination" title="Pagination" description="Page navigation controls.">
          <DemoRow label="Controls">
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationLink href="#">10</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </DemoRow>
        </GallerySection>

        <GallerySection id="collapsible" title="Collapsible" description="Toggle visibility of content — content animates open/closed.">
          <DemoRow label="Demo">
            <Collapsible className="w-64">
              <div className="flex items-center justify-between rounded-md border px-4 py-2">
                <span className="text-sm font-medium">Dependencies</span>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <ChevronsUpDown className="size-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-1 space-y-1">
                {["react", "vite", "tailwindcss", "typescript"].map((dep) => (
                  <div key={dep} className="rounded-md border px-4 py-2 text-sm font-mono text-muted-foreground">
                    {dep}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </DemoRow>
        </GallerySection>
      </SectionGroup>

      <SectionGroup title="Overlay" description="Modals, panels, menus, and floating UI elements.">
        <GallerySection id="dialog" title="Dialog" description="Modal overlay with focus trap.">
          <DemoRow label="Demo">
            <Dialog>
              <DialogTrigger asChild><Button variant="outline">Open Dialog</Button></DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Make changes to your profile here.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dlg-name">Name</Label>
                    <input id="dlg-name" defaultValue="Acme Corp" className="rounded-md border px-3 py-1.5 text-sm bg-background outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dlg-email">Email</Label>
                    <input id="dlg-email" type="email" defaultValue="acme@example.com" className="rounded-md border px-3 py-1.5 text-sm bg-background outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DemoRow>
        </GallerySection>

        <GallerySection id="alert-dialog" title="Alert Dialog" description="Confirmation dialog requiring explicit user action.">
          <DemoRow label="Demo">
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="destructive">Delete Account</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your account will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DemoRow>
        </GallerySection>

        <GallerySection id="sheet" title="Sheet" description="Slide-in side panel.">
          <DemoRow label="Sides">
            {(["left", "right", "top", "bottom"] as const).map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild><Button variant="outline" className="capitalize">{side}</Button></SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader>
                    <SheetTitle>Settings ({side})</SheetTitle>
                    <SheetDescription>Configure your preferences in this side panel.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4 px-4">
                    <div className="flex items-center justify-between">
                      <Label>Dark Mode</Label>
                      <Switch checked={darkMode} onCheckedChange={toggleDark} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Notifications</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </DemoRow>
        </GallerySection>

        <GallerySection id="drawer" title="Drawer" description="Bottom sheet drawer (mobile-friendly).">
          <DemoRow label="Demo">
            <Drawer>
              <DrawerTrigger asChild><Button variant="outline">Open Drawer</Button></DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Quick Actions</DrawerTitle>
                  <DrawerDescription>Select an action to perform.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-2 p-4">
                  <Button variant="outline" className="justify-start gap-2"><Copy className="size-4" /> Duplicate</Button>
                  <Button variant="outline" className="justify-start gap-2"><Settings className="size-4" /> Settings</Button>
                  <Button variant="destructive" className="justify-start gap-2"><Trash2 className="size-4" /> Delete</Button>
                </div>
                <div className="p-4 pt-0">
                  <DrawerClose asChild><Button variant="outline" className="w-full">Cancel</Button></DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          </DemoRow>
        </GallerySection>

        <GallerySection id="dropdown" title="Dropdown Menu" description="Contextual action menus.">
          <DemoRow label="Menus">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><User className="size-4" /> My Account <ChevronDown className="size-3 ml-1" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="size-4" /> Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem><CreditCard className="size-4" /> Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
                <DropdownMenuItem><Settings className="size-4" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive"><LogOut className="size-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><Bell className="size-4" /> Notifications</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={notifChecked.status} onCheckedChange={(v) => setNotifChecked((s) => ({ ...s, status: !!v }))}>
                  Status Updates
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={notifChecked.badge} onCheckedChange={(v) => setNotifChecked((s) => ({ ...s, badge: !!v }))}>
                  Badge Alerts
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DemoRow>
        </GallerySection>

        <GallerySection id="context-menu" title="Context Menu" description="Right-click contextual actions.">
          <DemoRow label="Demo">
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="w-72 h-24 rounded-lg border-2 border-dashed flex items-center justify-center text-sm text-muted-foreground select-none cursor-context-menu">
                  Right-click here
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-52">
                <ContextMenuLabel>Actions</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem><Copy className="size-4" /> Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuItem><Settings className="size-4" /> Rename</ContextMenuItem>
                <ContextMenuCheckboxItem checked>Show hidden</ContextMenuCheckboxItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive"><Trash2 className="size-4" /> Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </DemoRow>
        </GallerySection>

        <GallerySection id="popover" title="Popover" description="Floating content panels.">
          <DemoRow label="Demo">
            <Popover>
              <PopoverTrigger asChild><Button variant="outline">Open Popover</Button></PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quick Actions</p>
                  <p className="text-xs text-muted-foreground">Choose an action to perform.</p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="flex-1">Cancel</Button>
                    <Button size="sm" className="flex-1">Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </DemoRow>
        </GallerySection>

        <GallerySection id="tooltip" title="Tooltip" description="Short contextual hints on hover.">
          <DemoRow label="Placement">
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon"><Check className="size-4" /></Button></TooltipTrigger>
              <TooltipContent>Confirm selection</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon"><Info className="size-4" /></Button></TooltipTrigger>
              <TooltipContent side="bottom">More information</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon"><Settings className="size-4" /></Button></TooltipTrigger>
              <TooltipContent side="right">Open settings</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" size="icon"><Bell className="size-4" /></Button></TooltipTrigger>
              <TooltipContent side="left">Notifications</TooltipContent>
            </Tooltip>
          </DemoRow>
        </GallerySection>

        <GallerySection id="hover-card" title="Hover Card" description="Rich preview on hover.">
          <DemoRow label="Demo">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-base">@acme_corp</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-72">
                <div className="flex gap-3">
                  <Avatar><AvatarFallback>AC</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">Acme Corp</p>
                    <p className="text-xs text-muted-foreground">Building the future, one component at a time.</p>
                    <p className="text-xs text-muted-foreground mt-1">Joined June 2024</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </DemoRow>
        </GallerySection>

        <GallerySection id="progress" title="Progress" description="Visual completion indicators — bar animates with spring physics.">
          <DemoRow label="Sizes">
            <div className="w-full max-w-md space-y-3">
              <Progress value={progress} className="h-1.5" />
              <Progress value={progress} className="h-2.5" />
              <Progress value={progress} className="h-4 rounded-sm" />
              <div className="flex gap-2 items-center">
                <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.max(0, p - 10))}>-10</Button>
                <Button size="sm" variant="outline" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10</Button>
                <span className="text-sm tabular-nums text-muted-foreground">{progress}%</span>
              </div>
            </div>
          </DemoRow>
        </GallerySection>
      </SectionGroup>
    </TooltipProvider>
  );
}
