import {
  Battery,
  CalendarClock,
  ChevronLeft,
  CloudSun,
  CreditCard,
  Heart,
  Mail,
  MessageCircle,
  Mic,
  MoreHorizontal,
  QrCode,
  ScanLine,
  Search,
  Star,
  UserRound,
  Wifi,
  X,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"

type NewsItem = {
  title: string
  source: string
  image: string
}

const news: NewsItem[] = [
  { title: "锤子科技夏季新品发布会在即，先来细数媒体最关心的十大看点", source: "来自 新浪微博", image: "#7a4a2e" },
  { title: "后空翻已成历史，人形机器人阿特拉斯展现敏捷身手丨网易新闻", source: "来自 网易新闻", image: "#88a678" },
  { title: "解密 Space X 终极版猎鹰 9 号火箭 为啥它这么牛", source: "来自 腾讯新闻", image: "#7097c9" },
  { title: "《未央歌》第 9 期，胡德夫对话蒋勋", source: "来自 凤凰网", image: "#d8cbb7" },
  { title: "别惹鲨鱼！科尔曼隔扣奥尼尔后摇手指 大鲨鱼折断篮筐+狂扇 15 帽", source: "来自 今日头条", image: "#332a24" },
  { title: "#坚果 R1 拍摄技巧#合集，教你用手机拍大片", source: "来自 新浪微博", image: "#bc6456" },
  { title: "福布斯发布亚洲新锐女性榜：内地 4 位女性上榜", source: "来自 界面新闻", image: "#1c1c1c" },
]

const tabs = ["资讯", "锤子阅读", "收藏"]

function StatusBar({ dark = true }: { dark?: boolean }) {
  return (
    <div className={`flex h-[30px] items-center justify-between px-2.5 shadow-[inset_0_-1px_0_rgba(255,255,255,0.12)] ${dark ? "bg-[#050505] text-white" : "bg-[#244a6f] text-white"}`}>
      <div className="flex items-center gap-1.5 opacity-95">
        <UserRound className="size-[14px] fill-white stroke-white" />
        <MessageCircle className="size-[15px] fill-white stroke-white" />
        <Mail className="size-[16px] stroke-[2.4px]" />
      </div>
      <div className="text-[15px] font-medium leading-none tracking-normal text-white">7:30 PM</div>
      <div className="flex items-center gap-1.5 opacity-95">
        <Wifi className="size-[16px] stroke-[2.7px]" />
        <div className="flex h-4 items-end gap-[2px]">
          {[6, 8, 10, 12].map((height) => (
            <span className="w-[3px] rounded-[1px] bg-white" key={height} style={{ height }} />
          ))}
        </div>
        <Battery className="size-[20px] stroke-[2px]" />
      </div>
    </div>
  )
}

function PhoneScreen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`w-[360px] shrink-0 overflow-hidden rounded-[3px] border border-[#232323] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.16)] ${className}`}>
      <div className="flex h-[640px] flex-col">{children}</div>
    </div>
  )
}

function WeatherCard() {
  return (
    <div className="relative mx-2 mt-3 h-[134px] overflow-hidden rounded-[5px] bg-linear-to-br from-[#6796f0] to-[#8db4f1] px-6 py-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
      <div className="text-[44px] font-medium leading-none tracking-[-0.08em]">28<span className="align-top text-[18px] tracking-normal"> °C</span></div>
      <div className="mt-6 text-[13px] font-normal leading-6 text-white/86">晴　比昨天高 2 °C<br />8 月 19 日 北京</div>
      <div className="absolute right-7 top-7 size-[24px] rounded-full bg-[#ffd72e] shadow-[0_0_18px_rgba(255,215,46,0.55)]" />
      <div className="absolute right-[-12px] top-[-16px] size-[62px] rounded-full border border-white/25 bg-white/10" />
      <div className="absolute right-[78px] top-[80px] size-[30px] rounded-full bg-white/10" />
      <div className="absolute right-[60px] top-[73px] size-[17px] rounded-full bg-white/12" />
    </div>
  )
}

function ReminderCard() {
  return (
    <div className="mx-2 mt-2 grid h-[72px] grid-cols-[58px_1fr] overflow-hidden rounded-[5px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-center border-r border-[#e7e9eb]">
        <span className="size-[10px] rounded-full bg-linear-to-b from-[#9cb9ff] to-[#5d7fea]" />
      </div>
      <div className="flex min-w-0 flex-col justify-center px-4">
        <div className="flex items-center gap-2 text-[15px] font-normal text-[#5a6068]">
          <span className="flex size-[20px] items-center justify-center rounded-full bg-[#8aca37] text-white">♿</span>
          给家里买鸡蛋、牛奶和麦片
        </div>
        <div className="mt-2 flex items-center justify-between text-[12px] text-[#b1b6bb]">
          <span>今天 18:30–19:00</span>
          <span className="rounded-full bg-[#f3f4f5] px-2 py-0.5">📍 北京</span>
        </div>
      </div>
    </div>
  )
}

function MovieTicketCard() {
  return (
    <div className="mx-2 mt-2 grid h-[148px] grid-cols-[104px_1fr] overflow-hidden rounded-[5px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.16)]">
      <div className="m-1 rounded-[2px] bg-[linear-gradient(135deg,#c8202f,#244c83_58%,#171b20)] p-2 text-[12px] font-medium text-[#ffd15b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        蚁人2<br /><span className="text-[10px] text-white/80">黄蜂女现身</span>
      </div>
      <div className="flex flex-col justify-center gap-2 px-4 text-[13px] text-[#8d9298]">
        <Line label="取票序列号:" value="4009 8005 0066" />
        <Line label="取票验证码:" value="ZKLJOS" />
        <Line label="电影名称:" value="蚁人2：黄蜂女现身" />
        <Line label="时间:" value="8 月 24 日 19:50" />
        <Line label="地址:" value="保利国际影城（北京北苑华茂店）" />
      </div>
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-1">
      <span>{label}</span>
      <span className="truncate text-right text-[#60656c]">{value}</span>
    </div>
  )
}

function PayShortcut() {
  return (
    <div className="mx-2 mt-2 grid h-[84px] grid-cols-2 overflow-hidden rounded-[4px] bg-[#5d84ec] text-white shadow-[0_1px_2px_rgba(0,0,0,0.16)]">
      <button className="flex items-center justify-center gap-4 border-r border-white/20" type="button">
        <ScanLine className="size-[27px]" />
        <span className="text-[14px]">扫描二维码</span>
      </button>
      <button className="flex items-center justify-center gap-4" type="button">
        <CreditCard className="size-[28px]" />
        <span className="text-[14px]">支付宝付款</span>
      </button>
    </div>
  )
}

function NewsPreviewTabs() {
  return (
    <div className="mx-2 mt-3 overflow-hidden rounded-[4px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
      <div className="grid h-[42px] grid-cols-3 border-b border-[#e5e7ea]">
        {tabs.map((tab, index) => (
          <button
            className={`border-r border-[#e3e5e8] text-[15px] font-medium last:border-r-0 ${index === 0 ? "bg-linear-to-b from-[#c8c8c8] to-[#aaa] text-white" : "bg-white text-[#777d84]"}`}
            key={tab}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      {news.slice(0, 2).map((item) => (
        <NewsPreviewRow item={item} key={item.title} />
      ))}
    </div>
  )
}

function NewsPreviewRow({ item }: { item: NewsItem }) {
  return (
    <div className="grid h-[82px] grid-cols-[74px_1fr] border-b border-[#eceef0] px-3 py-3 last:border-b-0">
      <div className="rounded-[2px]" style={{ background: `linear-gradient(135deg, ${item.image}, #d9d9d9)` }} />
      <div className="ml-4 min-w-0">
        <div className="line-clamp-2 text-[14px] font-normal leading-[20px] text-[#444a51]">{item.title}</div>
        <div className="mt-1 text-[11px] text-[#b0b5ba]">{item.source}</div>
      </div>
    </div>
  )
}

function HomeScreen() {
  return (
    <PhoneScreen>
      <StatusBar dark={false} />
      <div className="min-h-0 flex-1 overflow-hidden bg-[#244a6f] pb-2">
        <WeatherCard />
        <ReminderCard />
        <MovieTicketCard />
        <PayShortcut />
        <NewsPreviewTabs />
      </div>
    </PhoneScreen>
  )
}

function NewsHeader() {
  return (
    <div className="flex h-[58px] items-center border-b border-[#dedfe2] bg-linear-to-b from-[#ffffff] to-[#f1f2f4] px-2 shadow-[inset_0_1px_0_#fff]">
      <button className="h-[36px] rounded-[4px] border border-[#d4d6da] bg-linear-to-b from-white to-[#eceef0] px-3 text-[15px] text-[#777d84] shadow-[inset_0_1px_0_#fff]" type="button">返回</button>
      <div className="flex-1 text-center text-[22px] font-normal tracking-[-0.04em] text-[#5f656d]">资讯</div>
      <button className="h-[36px] rounded-[4px] border border-[#d4d6da] bg-linear-to-b from-white to-[#eceef0] px-3 text-[14px] text-[#666c73] shadow-[inset_0_1px_0_#fff]" type="button">资讯兴趣筛选</button>
    </div>
  )
}

function CategoryTabs() {
  const items = ["推荐", "热点", "科技", "娱乐", "体育", "财经", "国际"]
  return (
    <div className="flex h-[48px] items-center border-b border-[#e5e7ea] bg-white px-4">
      {items.map((item, index) => (
        <button className={`mr-6 text-[15px] font-normal ${index === 0 ? "text-[#ee3d33]" : "text-[#9aa0a6]"}`} key={item} type="button">
          {item}
        </button>
      ))}
    </div>
  )
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <div className="grid h-[92px] grid-cols-[66px_1fr_24px] border-b border-[#edf0f2] bg-white px-4 py-3">
      <div className="rounded-[2px]" style={{ background: `linear-gradient(135deg, ${item.image}, #e2e2e2)` }} />
      <div className="ml-4 min-w-0">
        <div className="line-clamp-2 text-[16px] font-normal leading-[23px] text-[#3d434a]">{item.title}</div>
        <div className="mt-1 text-[11px] text-[#b1b6bb]">{item.source}</div>
      </div>
      <button className="flex items-start justify-center pt-3" type="button">
        <X className="size-[17px] text-[#d3d6da] stroke-[3px]" />
      </button>
    </div>
  )
}

function NewsScreen() {
  return (
    <PhoneScreen>
      <StatusBar />
      <NewsHeader />
      <CategoryTabs />
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        {news.map((item) => (
          <NewsRow item={item} key={item.title} />
        ))}
      </div>
    </PhoneScreen>
  )
}

function PayHeader() {
  return (
    <div className="flex h-[58px] items-center border-b border-[#3477d4] bg-[#4a86df] px-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
      <div className="w-[58px]" />
      <div className="flex-1 text-center text-[22px] font-normal tracking-[-0.04em]">向商家付钱</div>
      <button className="h-[36px] rounded-[4px] border border-[#3976c6] bg-linear-to-b from-[#5a93e9] to-[#3d7eda] px-3 text-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]" type="button">完成</button>
    </div>
  )
}

function Barcode() {
  return (
    <div className="mx-auto h-[78px] w-[265px] bg-[repeating-linear-gradient(90deg,#000_0_3px,#fff_3px_6px,#000_6px_8px,#fff_8px_13px,#000_13px_18px,#fff_18px_22px)]" />
  )
}

function QRPattern() {
  const cells = Array.from({ length: 225 }, (_, index) => {
    const x = index % 15
    const y = Math.floor(index / 15)
    const finder =
      (x < 4 && y < 4) ||
      (x > 10 && y < 4) ||
      (x < 4 && y > 10)
    const innerFinder =
      (x > 0 && x < 3 && y > 0 && y < 3) ||
      (x > 11 && x < 14 && y > 0 && y < 3) ||
      (x > 0 && x < 3 && y > 11 && y < 14)
    const black = finder ? !innerFinder : (x * 7 + y * 11 + index) % 5 < 2
    return black
  })

  return (
    <div className="relative mx-auto grid size-[174px] grid-cols-[repeat(15,1fr)] bg-white p-1">
      {cells.map((black, index) => (
        <span className={black ? "bg-black" : "bg-white"} key={index} />
      ))}
      <span className="absolute left-1/2 top-1/2 flex size-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[5px] bg-[#3f87e5] text-[16px] font-medium text-white">支</span>
    </div>
  )
}

function PayCard() {
  return (
    <div className="mx-5 mt-[68px] rounded-[5px] bg-white px-6 py-9 shadow-[0_2px_6px_rgba(0,0,0,0.18)]">
      <Barcode />
      <div className="mt-5 text-center text-[16px] font-normal text-[#484e55]">2897 ****** 查看数字</div>
      <div className="my-8 h-px bg-[#eeeeee]" />
      <QRPattern />
      <div className="mt-5 text-center text-[11px] font-normal text-[#b2b7bd]">付款码及数字每分钟更新，请当面使用勿泄露</div>
    </div>
  )
}

function PayScreen() {
  return (
    <PhoneScreen>
      <StatusBar />
      <div className="flex min-h-0 flex-1 flex-col bg-[#4a86df]">
        <PayHeader />
        <PayCard />
      </div>
    </PhoneScreen>
  )
}

export default function SmartisanLifeSuite() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <div
        className="mx-auto flex min-w-[1120px] justify-center gap-8"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <HomeScreen />
        <NewsScreen />
        <PayScreen />
      </div>
    </div>
  )
}
