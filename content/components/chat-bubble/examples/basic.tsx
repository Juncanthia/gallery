import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/chat-bubble"

export default function ChatBubbleBasicExample() {
  return (
    <div className="w-80 space-y-4">
      <BubbleGroup>
        <Bubble align="start">
          <BubbleContent>你好，今天天气不错！</BubbleContent>
        </Bubble>
        <Bubble align="end" variant="secondary">
          <BubbleContent>是的，适合出去走走。</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
