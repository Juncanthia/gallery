import { CopyButton } from "@/components/ui/copy-button"

export default function CopyButtonBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <code className="rounded bg-muted px-2 py-1 text-sm">npm install @project/ui</code>
        <CopyButton content="npm install @project/ui" />
      </div>

      <div className="flex items-center gap-2">
        <code className="rounded bg-muted px-2 py-1 text-sm">https://example.com/share/abc123</code>
        <CopyButton content="https://example.com/share/abc123" variant="outlined" />
      </div>
    </div>
  )
}
