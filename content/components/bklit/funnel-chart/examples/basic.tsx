import { FunnelChart } from "@/components/ui/bklit-funnel-chart"

const data = [
  { label: "访问", value: 5000 },
  { label: "注册", value: 3000 },
  { label: "下单", value: 1500 },
  { label: "支付", value: 800 },
  { label: "复购", value: 400 },
]

export default function Demo() {
  return (
    <div className="w-full max-w-2xl">
      <FunnelChart data={data} />
    </div>
  )
}
