import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockFiles,
  CodeBlockFilename,
  CodeBlockBody,
  CodeBlockItem,
  CodeBlockContent,
  CodeBlockCopyButton,
} from "@/components/blocks/code-block"

const sampleData = [
  {
    language: "typescript",
    filename: "utils.ts",
    code: `export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return date.toLocaleDateString()
}`,
  },
  {
    language: "css",
    filename: "styles.css",
    code: `.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}`,
  },
]

export default function CodeBlockBasicExample() {
  return (
    <CodeBlock
      data={sampleData}
      defaultValue="typescript"
      className="w-full max-w-sm"
    >
      <CodeBlockHeader>
        <CodeBlockFiles>
          {(item) => (
            <CodeBlockFilename key={item.language} value={item.language}>
              {item.filename}
            </CodeBlockFilename>
          )}
        </CodeBlockFiles>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem key={item.language} value={item.language}>
            <CodeBlockContent language={item.language as any}>
              {item.code}
            </CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  )
}
