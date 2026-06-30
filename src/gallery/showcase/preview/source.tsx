import {
  type BundledLanguage,
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockItem,
  CodeBlockHeader,
} from "@/components/blocks/code-block"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SiReact } from "react-icons/si"

import { transformImportPaths } from "./asset/code-transform"

type PreviewSourceProps = {
  source: { name: string; source: string }[]
}

function getLanguage(name: string): BundledLanguage {
  if (name.endsWith(".css")) {
    return "css"
  }

  return "tsx"
}

export function PreviewSource({ source }: PreviewSourceProps) {
  return (
    <div className="my-4 overflow-hidden rounded border border-border/50 bg-background">
      <Accordion
        className="divide-y divide-border/40"
        collapsible
        defaultValue={source.at(0)?.name}
        type="single"
      >
        {source.map(({ name, source: code }) => {
          const language = getLanguage(name)

          return (
            <AccordionItem className="border-none" key={name} value={name}>
              <AccordionTrigger className="flex h-8 items-center rounded-none border-border/40 bg-muted/30 px-3 py-0 text-muted-foreground transition-none hover:text-foreground hover:no-underline data-[state=open]:border-b [&>svg]:translate-y-0">
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <SiReact className="size-3.5 text-muted-foreground" />
                  <span>{name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="overflow-visible p-0" style={{ overflow: "visible" }}>
                <CodeBlock
                  className="overflow-visible rounded-none border-none"
                  data={[{ language, filename: name, code: transformImportPaths(code) }]}
                  defaultValue={language}
                >
                  <CodeBlockHeader className="h-8 border-b border-[var(--code-border-color)] bg-muted/10 px-3 py-1">
                    <div className="flex-1" />
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
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
