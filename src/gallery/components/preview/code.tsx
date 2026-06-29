import {
  type BundledLanguage,
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockItem,
  CodeBlockHeader,
  CodeBlockFilename,
  type CodeBlockProps,
} from "@/components/composite/code-block"

type PreviewCodeProps = {
  code: string
  language: BundledLanguage
  filename: string
}

export function PreviewCode({ code, language, filename }: PreviewCodeProps) {
  const data: CodeBlockProps["data"] = [
    {
      language,
      filename,
      code,
    },
  ]

  return (
    <CodeBlock
      className=""
      data={data}
      defaultValue={data[0].language}
    >
      <CodeBlockHeader>
        <CodeBlockFilename value={data[0].language}>
          {filename}
        </CodeBlockFilename>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem key={item.language} value={item.language}>
            <CodeBlockContent language={item.language as BundledLanguage}>
              {item.code}
            </CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  )
}
