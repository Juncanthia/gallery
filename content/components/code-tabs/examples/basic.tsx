import { CodeTabs } from "@/components/ui/code-tabs"

export default function CodeTabsBasicExample() {
  return (
    <CodeTabs
      className="w-full max-w-sm"
      codes={{
        npm: "npm install @project/ui",
        pnpm: "pnpm add @project/ui",
        yarn: "yarn add @project/ui",
        bun: "bun add @project/ui",
      }}
    />
  )
}
