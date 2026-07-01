import { CitationList } from "@/components/ui/citation-list"

const sampleCitations = [
  {
    id: "citation-1",
    href: "https://react.dev/reference/react/useState",
    title: "useState – React",
    snippet:
      "useState is a React Hook that lets you add a state variable to your component.",
    domain: "react.dev",
    type: "webpage" as const,
  },
  {
    id: "citation-2",
    href: "https://arxiv.org/abs/1706.03762",
    title: "Attention Is All You Need",
    snippet:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    domain: "arxiv.org",
    author: "Vaswani et al.",
    publishedAt: "2017-06-12T00:00:00Z",
    type: "article" as const,
  },
  {
    id: "citation-3",
    href: "https://nodejs.org/api/fs.html",
    title: "File system | Node.js v22 Documentation",
    snippet: "The node:fs module enables interacting with the file system...",
    domain: "nodejs.org",
    type: "document" as const,
  },
  {
    id: "citation-4",
    href: "https://github.com/vercel/ai-sdk",
    title: "vercel/ai-sdk: The AI Toolkit for TypeScript",
    snippet:
      "The Vercel AI SDK is a TypeScript toolkit designed to help developers build AI-powered applications...",
    domain: "github.com",
    type: "code" as const,
  },
]

export default function CitationListBasicDemo() {
  return (
    <div className="w-full max-w-xl">
      <CitationList id="demo-citation-list" citations={sampleCitations} />
    </div>
  )
}
