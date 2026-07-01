import {
  SandboxCodeEditor,
  SandboxLayout,
  SandboxPreview,
  SandboxProvider,
  SandboxTabs,
  SandboxTabsContent,
  SandboxTabsList,
  SandboxTabsTrigger,
} from "@/components/blocks/sandbox"

const files = {
  "/App.tsx": `export default function App() {
  return (
    <div className="flex h-full items-center justify-center bg-white p-8">
      <h1 className="text-2xl font-bold text-gray-900">Hello Sandbox!</h1>
    </div>
  )
}`,
}

export default function SandboxBasicExample() {
  return (
    <SandboxProvider files={files} template="react-ts">
      <SandboxLayout>
        <SandboxTabs defaultValue="preview" className="h-64">
          <SandboxTabsList>
            <SandboxTabsTrigger value="code">Code</SandboxTabsTrigger>
            <SandboxTabsTrigger value="preview">Preview</SandboxTabsTrigger>
          </SandboxTabsList>
          <SandboxTabsContent value="code">
            <SandboxCodeEditor />
          </SandboxTabsContent>
          <SandboxTabsContent value="preview">
            <SandboxPreview />
          </SandboxTabsContent>
        </SandboxTabs>
      </SandboxLayout>
    </SandboxProvider>
  )
}
