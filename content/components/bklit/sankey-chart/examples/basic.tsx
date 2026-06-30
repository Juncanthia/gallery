import { SankeyChart, SankeyLink, SankeyNode, SankeyTooltip } from "@/components/ui/bklit-sankey-chart"

const data = {
  nodes: [
    { name: "首页" },
    { name: "搜索页" },
    { name: "商品页" },
    { name: "购物车" },
    { name: "下单成功" },
  ],
  links: [
    { source: 0, target: 2, value: 80 },
    { source: 0, target: 3, value: 20 },
    { source: 1, target: 2, value: 50 },
    { source: 1, target: 3, value: 30 },
    { source: 2, target: 4, value: 60 },
    { source: 3, target: 4, value: 40 },
  ],
}

export default function Demo() {
  return (
    <SankeyChart data={data}>
      <SankeyLink />
      <SankeyNode />
      <SankeyTooltip />
    </SankeyChart>
  )
}
