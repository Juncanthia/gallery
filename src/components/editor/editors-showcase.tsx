"use client"

import { Code2, Copy, ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"
import { TooltipProvider } from "@radix-ui/react-tooltip"

import { PlateEditor } from "@/components/editor/plate-editor"

const deviceWidths = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
} as const

type Device = keyof typeof deviceWidths
type View = "preview" | "code"

export function PlateEditorsShowcase() {
  return (
    <div className="flex min-w-0 flex-col items-stretch gap-8 py-2">
      <PlateEditorBlock
        title="AI Editor"
        sourcePath="src/components/editor/plate-editor.tsx"
        command="npx shadcn@latest add @plate/editor-ai"
      />
    </div>
  )
}

function PlateEditorBlock({
  title,
  sourcePath,
  command,
}: {
  title: string
  sourcePath: string
  command: string
}) {
  const [view, setView] = useState<View>("preview")
  const [device, setDevice] = useState<Device>("desktop")
  const [frameKey, setFrameKey] = useState(0)

  return (
    <section
      className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
      data-view={view}
      style={{ ["--height" as string]: "650px" }}
    >
      <div className="flex w-full items-center gap-2 pl-2 md:pr-6">
        <div className="hidden flex-col gap-2 sm:flex">
          <div className="grid h-8 grid-cols-2 items-center rounded-lg bg-muted p-1 text-muted-foreground">
            <button
              className={tabClass(view === "preview")}
              onClick={() => setView("preview")}
              type="button"
            >
              Preview
            </button>
            <button
              className={tabClass(view === "code")}
              onClick={() => setView("code")}
              type="button"
            >
              Code
            </button>
          </div>
        </div>
        <Separator className="mx-2 hidden h-4 sm:flex" />
        <span className="font-medium text-sm underline-offset-2">{title}</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden h-8 items-center gap-1.5 rounded-md border p-[3px] shadow-none lg:flex">
            <div className="flex w-fit items-center gap-1 rounded-md">
              <DeviceButton
                active={device === "desktop"}
                icon={<Monitor />}
                label="Desktop"
                onClick={() => setDevice("desktop")}
              />
              <DeviceButton
                active={device === "tablet"}
                icon={<Tablet />}
                label="Tablet"
                onClick={() => setDevice("tablet")}
              />
              <DeviceButton
                active={device === "mobile"}
                icon={<Smartphone />}
                label="Mobile"
                onClick={() => setDevice("mobile")}
              />
              <Separator className="h-4" />
              <button
                className="inline-flex size-6 items-center justify-center rounded-sm p-0 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setFrameKey((v) => v + 1)}
                title="Remount Editor"
                type="button"
              >
                <span className="sr-only">Remount Editor</span>
              </button>
            </div>
          </div>
          <Separator className="mx-1 hidden h-4 lg:flex" />
          <button
            className="inline-flex h-8 w-fit shrink-0 items-center justify-center gap-1 rounded-md border bg-background px-2 text-sm shadow-none hover:bg-accent hover:text-accent-foreground"
            type="button"
          >
            <Copy className="size-4" />
            <span className="hidden lg:inline">{command}</span>
          </button>
        </div>
      </div>

      {view === "preview" ? (
        <div className="h-(--height)">
          <div className="relative grid size-full gap-4">
            <div className="absolute inset-0 right-4 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#404040_1px,transparent_1px)]" />
            <div className="relative z-10 flex size-full justify-center overflow-hidden rounded-lg border bg-background md:rounded-xl">
              <div className="size-full max-w-full overflow-auto bg-background" style={{ width: deviceWidths[device] }}>
                <TooltipProvider>
                  <PlateEditor key={frameKey} />
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between border-b bg-background px-3 py-2 text-xs text-muted-foreground">
            <span>{sourcePath}</span>
            <Copy className="size-3.5" />
          </div>
          <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-6">
            <code>{`import { PlateEditor } from "@/components/editor/plate-editor"

export default function Page() {
  return (
    <div className="h-screen w-full">
      <PlateEditor />
    </div>
  )
}`}</code>
          </pre>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pl-2 text-xs text-muted-foreground">
        <Code2 className="size-3.5" />
        <span>{sourcePath}</span>
        <a
          className="inline-flex items-center gap-1 underline-offset-2 hover:underline"
          href="https://platejs.org"
          target="_blank"
          rel="noreferrer"
        >
          Plate.js <ExternalLink className="size-3" />
        </a>
      </div>
    </section>
  )
}

function DeviceButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={`inline-flex size-6 items-center justify-center rounded-sm p-0 hover:bg-muted hover:text-muted-foreground ${
        active ? "bg-accent text-accent-foreground" : "bg-transparent"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <span className="sr-only">{label}</span>
      <span className="[&_svg]:size-4">{icon}</span>
    </button>
  )
}

function Separator({ className = "" }: { className?: string }) {
  return <div className={`w-px shrink-0 bg-border ${className}`} role="none" />
}

function tabClass(active: boolean) {
  return `inline-flex h-6 flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 font-medium text-xs transition-colors ${
    active
      ? "bg-background text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground"
  }`
}
