import {
  EditorBubbleMenu,
  EditorFormatBold,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatCode,
  EditorLinkSelector,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeBulletList,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeCode,
  EditorNodeText,
  EditorProvider,
  EditorSelector,
} from "@/components/ui/editor"

export default function EditorBasicExample() {
  return (
    <EditorProvider
      className="w-full"
      placeholder="Start writing or type / for commands..."
      limit={5000}
    >
      <EditorBubbleMenu>
        <EditorSelector title="Text">
          <EditorNodeText />
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeHeading3 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeQuote />
          <EditorNodeCode />
        </EditorSelector>
        <EditorFormatBold hideName />
        <EditorFormatItalic hideName />
        <EditorFormatStrike hideName />
        <EditorFormatCode hideName />
        <EditorLinkSelector />
      </EditorBubbleMenu>
    </EditorProvider>
  )
}
