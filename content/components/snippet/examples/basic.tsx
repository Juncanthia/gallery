import {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
} from "@/components/ui/snippet"

export default function SnippetBasicExample() {
  return (
    <Snippet defaultValue="npm">
      <SnippetHeader>
        <SnippetTabsList>
          <SnippetTabsTrigger value="npm">npm</SnippetTabsTrigger>
          <SnippetTabsTrigger value="yarn">yarn</SnippetTabsTrigger>
          <SnippetTabsTrigger value="pnpm">pnpm</SnippetTabsTrigger>
        </SnippetTabsList>
        <SnippetCopyButton value="npm install @my-lib/core" />
      </SnippetHeader>
      <SnippetTabsContent value="npm">
        npm install @my-lib/core
      </SnippetTabsContent>
      <SnippetTabsContent value="yarn">
        yarn add @my-lib/core
      </SnippetTabsContent>
      <SnippetTabsContent value="pnpm">
        pnpm add @my-lib/core
      </SnippetTabsContent>
    </Snippet>
  )
}
