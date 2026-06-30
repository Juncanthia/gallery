import { PromoBanner } from "@/components/ui/gooseui-promo-banner"

export default function Demo() {
  return (
    <div className="relative h-96 rounded-xl border bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <p className="text-center text-sm text-slate-500">
        PromoBanner 固定在视口角落显示，查看页面 {">>"} 右下角
      </p>
      <PromoBanner
        title="限时特惠"
        headline="年度旗舰新品首发"
        price={299}
        originalPrice={599}
        currency="￥"
        ctaText="立即抢购"
        ctaHref="#"
        marqueeText="全场满199包邮 • 7天无理由退货 • 正品保证"
        position="bottom-right"
        gradientFrom="from-violet-600"
        gradientTo="to-pink-600"
        showPattern
        defaultOpen
        delay={300}
      />
    </div>
  )
}
