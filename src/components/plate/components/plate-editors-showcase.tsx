"use client"

import {
  Code2,
  Copy,
  ExternalLink,
  Fullscreen,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
} from 'lucide-react'
import { useState } from 'react'

const blocks = [
  {
    id: 'editor-ai',
    title: 'An AI editor',
    command: 'npx shadcn@latest add @plate/editor-ai',
    height: 650,
    src: 'https://platejs.org/view/editor-ai',
    sourcePath: 'references/plate/apps/www/src/registry/blocks/editor-ai',
    code: `import { Toaster } from 'sonner';

import { PlateEditor } from '@/registry/blocks/editor-ai/components/editor/plate-editor';

export default function Page() {
  return (
    <div className="h-screen w-full">
      <PlateEditor />
      <Toaster />
    </div>
  );
}`,
  },
  {
    id: 'editor-select',
    title: 'A multi-select editor',
    command: 'npx shadcn@latest add @plate/editor-select',
    height: 650,
    src: 'https://platejs.org/view/editor-select',
    sourcePath: 'references/plate/apps/www/src/registry/blocks/editor-select',
    code: `import EditorSelectForm from '@/registry/examples/select-editor-demo';

export default function Page() {
  return (
    <div className="flex h-screen w-full justify-center">
      <EditorSelectForm />
    </div>
  );
}`,
  },
  {
    id: 'editor-basic',
    title: 'A basic editor',
    command: 'npx shadcn@latest add @plate/editor-basic',
    height: 520,
    src: 'https://platejs.org/view/editor-basic',
    sourcePath: 'references/plate/apps/www/src/registry/blocks/editor-basic',
    code: `import { PlateEditor } from '@/registry/blocks/editor-basic/components/editor/plate-editor';

export default function Page() {
  return (
    <div className="h-screen w-full">
      <PlateEditor />
    </div>
  );
}`,
  },
]

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
} as const

type Device = keyof typeof deviceWidths
type View = 'preview' | 'code'

export function PlateEditorsShowcase() {
  return (
    <div className="flex min-w-0 flex-col items-stretch gap-8 py-2">
      {blocks.map((block) => (
        <PlateEditorBlock key={block.id} block={block} />
      ))}
    </div>
  )
}

function PlateEditorBlock({ block }: { block: (typeof blocks)[number] }) {
  const [view, setView] = useState<View>('preview')
  const [device, setDevice] = useState<Device>('desktop')
  const [frameKey, setFrameKey] = useState(0)

  return (
    <section
      className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
      data-view={view}
      id={block.id}
      style={{ ['--height' as string]: `${block.height}px` }}
    >
      <div className="flex w-full items-center gap-2 pl-2 md:pr-6">
        <div className="hidden flex-col gap-2 sm:flex">
          <div className="grid h-8 grid-cols-2 items-center rounded-lg bg-muted p-1 text-muted-foreground">
            <button
              className={tabClass(view === 'preview')}
              onClick={() => setView('preview')}
              type="button"
            >
              Preview
            </button>
            <button className={tabClass(view === 'code')} onClick={() => setView('code')} type="button">
              Code
            </button>
          </div>
        </div>
        <Separator className="mx-2 hidden h-4 sm:flex" />
        <a className="font-medium text-sm underline-offset-2 hover:underline" href={block.src}>
          {block.title}
        </a>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden h-8 items-center gap-1.5 rounded-md border p-[3px] shadow-none lg:flex">
            <div className="flex w-fit items-center gap-1 rounded-md">
              <DeviceButton
                active={device === 'desktop'}
                icon={<Monitor />}
                label="Desktop"
                onClick={() => setDevice('desktop')}
              />
              <DeviceButton
                active={device === 'tablet'}
                icon={<Tablet />}
                label="Tablet"
                onClick={() => setDevice('tablet')}
              />
              <DeviceButton
                active={device === 'mobile'}
                icon={<Smartphone />}
                label="Mobile"
                onClick={() => setDevice('mobile')}
              />
              <Separator className="h-4" />
              <a
                className="inline-flex size-6 items-center justify-center rounded-sm p-0 hover:bg-accent hover:text-accent-foreground"
                href={block.src}
                target="_blank"
                title="Open in New Tab"
              >
                <span className="sr-only">Open in New Tab</span>
                <Fullscreen className="size-4" />
              </a>
              <Separator className="h-4" />
              <button
                className="inline-flex size-6 items-center justify-center rounded-sm p-0 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setFrameKey((value) => value + 1)}
                title="Refresh Preview"
                type="button"
              >
                <RotateCw className="size-4" />
                <span className="sr-only">Refresh Preview</span>
              </button>
            </div>
          </div>
          <Separator className="mx-1 hidden h-4 lg:flex" />
          <button
            className="inline-flex h-8 w-fit shrink-0 items-center justify-center gap-1 rounded-md border bg-background px-2 text-sm shadow-none hover:bg-accent hover:text-accent-foreground"
            type="button"
          >
            <Terminal className="size-4" />
            <span className="hidden lg:inline">{block.command}</span>
          </button>
        </div>
      </div>

      {view === 'preview' ? (
        <div className="h-(--height)">
          <div className="relative grid size-full gap-4">
            <div className="absolute inset-0 right-4 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#404040_1px,transparent_1px)]" />
            <div className="relative z-10 flex size-full justify-center overflow-hidden rounded-lg border bg-background md:rounded-xl">
              <div className="size-full max-w-full bg-background" style={{ width: deviceWidths[device] }}>
                <iframe
                  key={frameKey}
                  className="relative z-20 size-full bg-background"
                  height="100%"
                  sandbox="allow-scripts allow-same-origin allow-top-navigation allow-forms"
                  src={block.src}
                  title={block.id}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between border-b bg-background px-3 py-2 text-xs text-muted-foreground">
            <span>{block.sourcePath}</span>
            <Copy className="size-3.5" />
          </div>
          <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-6">
            <code>{block.code}</code>
          </pre>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pl-2 text-xs text-muted-foreground">
        <Code2 className="size-3.5" />
        <span>Forked source: {block.sourcePath}</span>
        <a className="inline-flex items-center gap-1 underline-offset-2 hover:underline" href={block.src}>
          View route <ExternalLink className="size-3" />
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
        active ? 'bg-accent text-accent-foreground' : 'bg-transparent'
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

function Separator({ className = '' }: { className?: string }) {
  return <div className={`w-px shrink-0 bg-border ${className}`} role="none" />
}

function tabClass(active: boolean) {
  return `inline-flex h-6 flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-2 py-1 font-medium text-xs transition-colors ${
    active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
  }`
}
