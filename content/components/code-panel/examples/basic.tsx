import { Code, CodeBlock, CodeHeader } from "@/components/ui/code-panel"

const sampleCode = `function greet(name: string) {
  return "Hello, " + name
}

console.log(greet("World"))`

export default function CodePanelBasicExample() {
  return (
    <Code code={sampleCode} className="w-full max-w-sm">
      <CodeHeader copyButton>example.ts</CodeHeader>
      <CodeBlock />
    </Code>
  )
}
