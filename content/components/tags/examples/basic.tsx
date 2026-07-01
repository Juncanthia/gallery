"use client"

import { useState } from "react"
import {
  Tags,
  TagsTrigger,
  TagsValue,
  TagsContent,
  TagsInput,
  TagsList,
  TagsEmpty,
  TagsGroup,
  TagsItem,
} from "@/components/blocks/tags"

const initialTags = ["react", "typescript"]

export default function TagsBasicExample() {
  const [selectedTags, setSelectedTags] = useState(initialTags)

  const handleRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSelect = (value: string) => {
    if (!selectedTags.includes(value)) {
      setSelectedTags((prev) => [...prev, value])
    }
  }

  return (
    <Tags
      className="w-full max-w-sm"
      open={undefined}
      onOpenChange={undefined}
      value={selectedTags.join(",")}
      setValue={() => {}}
    >
      <TagsTrigger>
        {selectedTags.map((tag) => (
          <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
            {tag}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsInput placeholder="Search tags..." />
        <TagsList>
          <TagsEmpty>No tags found.</TagsEmpty>
          <TagsGroup heading="Frontend">
            <TagsItem value="react" onSelect={() => handleSelect("react")}>
              React
            </TagsItem>
            <TagsItem value="vue" onSelect={() => handleSelect("vue")}>
              Vue
            </TagsItem>
            <TagsItem value="angular" onSelect={() => handleSelect("angular")}>
              Angular
            </TagsItem>
          </TagsGroup>
          <TagsGroup heading="Languages">
            <TagsItem
              value="typescript"
              onSelect={() => handleSelect("typescript")}
            >
              TypeScript
            </TagsItem>
            <TagsItem
              value="javascript"
              onSelect={() => handleSelect("javascript")}
            >
              JavaScript
            </TagsItem>
            <TagsItem value="rust" onSelect={() => handleSelect("rust")}>
              Rust
            </TagsItem>
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  )
}
