import { BalancedHeading } from "@/components/ui/balanced-text"

export default function Demo() {
  return (
    <div className="space-y-6 max-w-lg">
      <BalancedHeading as="h1">
        BalancedHeading 使用 CSS text-wrap: balance 自动均衡多行标题排版
      </BalancedHeading>
      <BalancedHeading as="h2">
        当标题文本跨多行时，text-wrap: balance 让每行宽度尽量接近
      </BalancedHeading>
      <BalancedHeading as="h3">
        告别"最后一行只剩两个字"的尴尬断行，提升排版质感
      </BalancedHeading>
    </div>
  )
}
