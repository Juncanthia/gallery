import { StackingCardsAnimated } from "@/components/effects/interactions/gooseui/stacking-cards"

const cards = [
  {
    title: "卡片一",
    description: "向下滚动，卡片将依次堆叠并缩小淡出，产生层叠视觉效果。",
  },
  {
    title: "卡片二",
    description: "每张卡片使用 sticky 定位固定在视口顶部，配合滚动驱动动画。",
  },
  {
    title: "卡片三",
    description: "进入视口时卡片恢复正常尺寸，离开时自动缩小并降低透明度。",
  },
  {
    title: "卡片四",
    description: "堆叠卡片适用于产品特性展示、步骤说明、时间线等场景。",
  },
]

export default function Demo() {
  return (
    <StackingCardsAnimated>
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {card.description}
          </p>
        </div>
      ))}
    </StackingCardsAnimated>
  )
}
