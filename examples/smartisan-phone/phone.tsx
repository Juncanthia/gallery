import { useMemo, useState } from "react"
import {
  Battery,
  Check,
  ChevronRight,
  Delete,
  Grid3X3,
  ListFilter,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Star,
  User,
  Users,
  Wifi,
} from "lucide-react"

type Contact = {
  id: string
  name: string
  phone: string
  location: string
  pinyin: string
  favorite?: boolean
}

type RecentCall = {
  id: string
  title: string
  phone: string
  location: string
  time: string
  missed?: boolean
}

const contacts: Contact[] = [
  {
    id: "me",
    name: "设置我的个人资料",
    phone: "",
    location: "我",
    pinyin: "wo",
  },
  {
    id: "hefang",
    name: "何方",
    phone: "136 3300 8012",
    location: "最近添加",
    pinyin: "hefang",
  },
  {
    id: "aaron",
    name: "Aaron",
    phone: "010 6655 0011",
    location: "A",
    pinyin: "aaron",
  },
  {
    id: "anpeng",
    name: "安鹏",
    phone: "139 2048 4096",
    location: "A",
    pinyin: "anpeng",
  },
  {
    id: "baihai",
    name: "白海",
    phone: "138 0099 1188",
    location: "B",
    pinyin: "baihai",
  },
  {
    id: "baijiadi",
    name: "白佳迪",
    phone: "150 1122 3344",
    location: "B",
    pinyin: "baijiadi",
  },
  {
    id: "chenbingtian",
    name: "陈冰天",
    phone: "186 0065 8091",
    location: "C",
    pinyin: "chenbingtian",
  },
  {
    id: "linxi",
    name: "林夕",
    phone: "138 0011 2233",
    location: "L",
    pinyin: "linxi",
    favorite: true,
  },
  {
    id: "lingjun",
    name: "令军",
    phone: "135 2233 4455",
    location: "L",
    pinyin: "lingjun",
  },
  {
    id: "liuchen",
    name: "刘晨",
    phone: "139 1111 2222",
    location: "L",
    pinyin: "liuchen",
  },
  {
    id: "liuxiangyu",
    name: "刘翔宇",
    phone: "188 8888 8888",
    location: "L",
    pinyin: "liuxiangyu",
    favorite: true,
  },
  {
    id: "liudushi",
    name: "刘杜仕",
    phone: "133 9876 5432",
    location: "L",
    pinyin: "liudushi",
  },
]


const initialRecents: RecentCall[] = [
  {
    id: "r1",
    title: "186 0065 8091",
    phone: "186 0065 8091",
    location: "北京 联通",
    time: "下午6:38",
    missed: true,
  },
  {
    id: "r2",
    title: "王益巨",
    phone: "186 0065 8091",
    location: "电话",
    time: "上午9:36",
    missed: true,
  },
  {
    id: "r3",
    title: "武磊",
    phone: "135 2233 4455",
    location: "上海 移动",
    time: "周一",
  },
]

const dialKeys = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  ["*", ","],
  ["0", "+"],
  ["#", ";"],
] as const

const t9Map: Record<string, string> = {
  "2": "abc",
  "3": "def",
  "4": "ghi",
  "5": "jkl",
  "6": "mno",
  "7": "pqrs",
  "8": "tuv",
  "9": "wxyz",
}

function playDtmfTone(key: string) {
  if (typeof window === "undefined") return

  const AudioContext = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContext) return

  const frequencies: Record<string, [number, number]> = {
    "1": [697, 1209],
    "2": [697, 1336],
    "3": [697, 1477],
    "4": [770, 1209],
    "5": [770, 1336],
    "6": [770, 1477],
    "7": [852, 1209],
    "8": [852, 1336],
    "9": [852, 1477],
    "*": [941, 1209],
    "0": [941, 1336],
    "#": [941, 1477],
  }

  try {
    const context = new AudioContext()
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.05, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12)
    gain.connect(context.destination)

    const pair = frequencies[key]
    if (!pair) {
      const oscillator = context.createOscillator()
      oscillator.frequency.setValueAtTime(1000, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(180, context.currentTime + 0.04)
      oscillator.connect(gain)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.04)
      return
    }

    pair.forEach((frequency) => {
      const oscillator = context.createOscillator()
      oscillator.frequency.value = frequency
      oscillator.connect(gain)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.12)
    })
  } catch {
    // 浏览器可能拒绝非用户手势音频，忽略即可。
  }
}

function toT9(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => Object.entries(t9Map).find(([, letters]) => letters.includes(char))?.[0] ?? "")
    .join("")
}

function StatusBar() {
  return (
    <div className="flex h-[30px] items-center justify-between bg-[#1c1c1c] px-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-1.5 opacity-95">
        <Users className="size-[14px] fill-white stroke-white" />
        <MessageCircle className="size-[15px] fill-white stroke-white" />
        <Mail className="size-[15px] stroke-[2.5px]" />
      </div>
      <div className="text-[16px] font-medium leading-none tracking-normal text-white">
        7:30PM
      </div>
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

function EmptyHeader() {
  return (
    <div
      className="h-[82px] border-b border-[#d4d4d4] bg-white"
      style={{
        background:
          "linear-gradient(180deg,#ffffff 0%,#ffffff 72%,#fafafa 86%,#f1f1f1 100%)",
        boxShadow:
          "inset 0 -1px 0 rgba(255,255,255,0.85), inset 0 -7px 12px rgba(0,0,0,0.055)",
      }}
    />
  )
}

function RecentRow({ recent, compact = false }: { recent: RecentCall; compact?: boolean }) {
  return (
    <button
      className={`group flex w-full items-center justify-between border-b border-[#dddddd] bg-[#fbfbfb] px-[18px] text-left transition-colors active:bg-[#eeeeee] ${
        compact ? "h-[62px]" : "h-[56.5px]"
      }`}
      type="button"
    >
      <div className="min-w-0">
        <div
          className={`truncate text-[21px] leading-[24px] tracking-[-0.015em] ${
            recent.missed ? "text-[#c5514d]" : "text-[#111111]"
          }`}
        >
          {recent.title}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[13px] leading-none text-[#a6abb1]">
          <Phone className="size-[15px] fill-[#dd7a6f] stroke-[#dd7a6f]" />
          <span>{recent.location}</span>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-3">
        <span className="text-[16px] font-medium text-[#5d7ed4]">{recent.time}</span>
        <span className="grid size-[32px] place-items-center rounded-full border border-[#d6d6d6] bg-[linear-gradient(180deg,#ffffff,#eeeeee)] text-[#858a90] shadow-[0_2px_5px_rgba(0,0,0,0.16),inset_0_1px_0_#ffffff] group-active:translate-y-px group-active:shadow-inner">
          <ChevronRight className="size-6 stroke-[4px]" />
        </span>
      </div>
    </button>
  )
}

function RecentsPanel({ recents }: { recents: RecentCall[] }) {
  return (
    <div className="h-[170px] overflow-hidden border-b border-[#cfcfcf] bg-[#fbfbfb]">
      {recents.slice(0, 3).map((recent) => (
        <RecentRow key={recent.id} recent={recent} />
      ))}
    </div>
  )
}

function ThumbSweepOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 360 300">
        <path
          d="M138 0 C250 34 334 155 318 300 L360 300 L360 0 Z"
          fill="rgba(116, 191, 255, 0.25)"
        />
        <path
          d="M138 0 C250 34 334 155 318 300"
          fill="none"
          stroke="#347bff"
          strokeOpacity="0.94"
          strokeWidth="1.3"
        />
      </svg>
    </div>
  )
}

function DialKey({ digit, letters, onPress }: { digit: string; letters: string; onPress: (digit: string) => void }) {
  const isOne = digit === "1"

  return (
    <button
      className={`relative flex flex-col items-center justify-center overflow-hidden border-b border-r border-[#cbd0d5] active:translate-y-px active:brightness-95 ${
        isOne
          ? "z-10 bg-[linear-gradient(180deg,#ff5958_0%,#ff6d6b_50%,#f05250_100%)] text-[#a52f2d] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
          : "bg-[linear-gradient(180deg,#f7f8f8_0%,#eceff0_52%,#e4e7e9_100%)] text-[#324256] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
      }`}
      onClick={() => onPress(digit)}
      type="button"
    >
      <span className={`text-[34px] font-normal leading-[34px] tracking-normal ${isOne ? "text-[#b73534]" : "text-[#344558]"}`}>
        {digit}
      </span>
      <span className={`mt-1 h-[11px] text-[10px] font-normal leading-[10px] tracking-wide ${isOne ? "text-[#c95b5a]" : "text-[#a0a8b0]"}`}>
        {letters}
      </span>
    </button>
  )
}

function DialPad({ onPress, onCall, onBackspace }: { onPress: (digit: string) => void; onCall: () => void; onBackspace: () => void }) {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#e9ecef]">
      <ThumbSweepOverlay />

      <div className="relative z-10 grid h-full grid-cols-3 grid-rows-5 border-t border-[#cbd0d5]">
        {dialKeys.map(([digit, letters]) => (
          <DialKey digit={digit} key={digit} letters={letters} onPress={onPress} />
        ))}

        <button
          className="flex items-center justify-center border-r border-[#cbd0d5] bg-[linear-gradient(180deg,#f6f8f9,#e4e8ec)] text-[#344f76] active:translate-y-px active:brightness-95"
          type="button"
        >
          <Users className="size-[34px] stroke-[2.6px]" />
        </button>
        <button
          className="flex items-center justify-center border-r border-[#3b7d61] bg-[linear-gradient(180deg,#5ca87d,#458c68)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] active:translate-y-px active:brightness-95"
          onClick={onCall}
          type="button"
        >
          <Phone className="size-[34px] fill-white stroke-white" />
        </button>
        <button
          className="flex items-center justify-center bg-[linear-gradient(180deg,#f6f8f9,#e4e8ec)] text-[#345279] active:translate-y-px active:brightness-95"
          onClick={onBackspace}
          type="button"
        >
          <Delete className="size-[32px] fill-[#345279]/20 stroke-[2.8px]" />
        </button>
      </div>
    </div>
  )
}

function TabBar({ activeTab, setActiveTab }: { activeTab: TabId; setActiveTab: (tab: TabId) => void }) {
  const tabs: Array<{ id: TabId; label: string; icon: typeof User }> = [
    { id: "recents", label: "通话记录", icon: ChevronRight },
    { id: "contacts", label: "联系人", icon: User },
    { id: "dialer", label: "拨号", icon: Grid3X3 },
    { id: "favorites", label: "收藏", icon: Star },
  ]

  return (
    <div className="grid h-[72px] grid-cols-4 border-t border-[#0c0c0c] bg-[linear-gradient(180deg,#2a2a2a_0%,#171717_54%,#101010_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = activeTab === tab.id

        return (
          <button
            className={`relative flex flex-col items-center justify-center gap-1 border-r border-black/20 text-[#9fb8de] transition-all last:border-r-0 active:brightness-110 ${
              active
                ? "bg-[linear-gradient(180deg,#111111,#242424_52%,#0f0f0f)] text-white shadow-[inset_0_3px_8px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-[#8d8d8d] shadow-[inset_1px_0_0_rgba(255,255,255,0.06)]"
            }`}
            key={tab.id}
            onClick={() => {
              playDtmfTone("click")
              setActiveTab(tab.id)
            }}
            type="button"
          >
            {tab.id === "recents" ? (
              <span className="grid size-[38px] place-items-center rounded-full border-[3px] border-current opacity-70">
                <ChevronRight className="size-[20px] rotate-180 stroke-[3px]" />
              </span>
            ) : (
              <Icon className={`size-[34px] ${tab.id === "favorites" ? "fill-current" : ""} ${active ? "opacity-100" : "opacity-55"}`} />
            )}
            <span className={`text-[12px] leading-none tracking-[0.03em] ${active ? "opacity-95" : "opacity-50"}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type TabId = "recents" | "contacts" | "dialer" | "favorites"

function DialerScreen({
  dialNumber,
  recents,
  onBackspace,
  onCall,
  onDigit,
}: {
  dialNumber: string
  recents: RecentCall[]
  onBackspace: () => void
  onCall: () => void
  onDigit: (digit: string) => void
  }) {
  return (
    <>
      <EmptyHeader />
      {dialNumber ? (
        <div className="h-[170px] border-b border-[#cfcfcf] bg-white">
          <div className="flex h-[72px] items-center border-b border-[#dddddd] px-[18px]">
            <div className="min-w-0 flex-1 truncate text-[30px] font-medium tracking-[0.02em] text-[#c5514d]">
              {dialNumber}
            </div>
            <button className="grid size-8 place-items-center rounded-full bg-[#eeeeee] text-[#777777]" onClick={onBackspace} type="button">
              <Delete className="size-5" />
            </button>
          </div>
          <div className="divide-y divide-[#eeeeee]">
            {contacts
              .filter((contact) => {
                const phone = contact.phone.replace(/\s+/g, "")
                return phone.includes(dialNumber) || toT9(contact.pinyin).includes(dialNumber)
              })
              .slice(0, 2)
              .map((contact) => (
                <button className="flex h-[49px] w-full items-center justify-between px-[18px] text-left active:bg-[#eeeeee]" key={contact.id} type="button">
                  <div>
                    <div className="text-[18px] text-[#222222]">{contact.name}</div>
                    <div className="text-[13px] text-[#a6abb1]">{contact.phone}</div>
                  </div>
                  <span className="text-[12px] font-normal text-[#5d7ed4]">T9</span>
                </button>
              ))}
          </div>
        </div>
      ) : (
        <RecentsPanel recents={recents} />
      )}
      <DialPad onBackspace={onBackspace} onCall={onCall} onPress={onDigit} />
    </>
  )
}

function ToolbarButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="h-[38px] min-w-[62px] rounded-[5px] border border-[#aeb2b8] bg-[linear-gradient(180deg,#d7d9dd_0%,#bbbfc6_48%,#a8adb5_100%)] px-4 text-[16px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_1px_1px_rgba(0,0,0,0.12)] active:translate-y-px active:shadow-inner"
      type="button"
    >
      {children}
    </button>
  )
}

function SegmentedControl() {
  return (
    <div className="grid h-[38px] w-[166px] grid-cols-2 overflow-hidden rounded-[5px] border border-[#aeb2b8] bg-[#b9bdc4] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
      <button className="border-r border-[#9da2ab] bg-[linear-gradient(180deg,#d5d7db,#bcc0c7)] text-[16px] font-medium text-white" type="button">
        群组
      </button>
      <button className="bg-[linear-gradient(180deg,#bfc3ca,#a4a9b2)] text-[16px] font-medium text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.10)]" type="button">
        全部
      </button>
    </div>
  )
}

function SimpleListScreen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-[#f4f4f4]">
      <div className="flex h-[52px] items-center border-b border-[#d6d6d6] bg-[linear-gradient(180deg,#ffffff,#eeeeee)] px-[18px] text-[22px] font-medium text-[#222222] shadow-[inset_0_-3px_8px_rgba(0,0,0,0.06)]">
        {title}
      </div>
      <div className="flex-1 overflow-y-auto bg-white">{children}</div>
    </div>
  )
}

const contactSections = [
  { title: "我", items: contacts.filter((contact) => contact.location === "我") },
  { title: "最近添加", items: contacts.filter((contact) => contact.location === "最近添加") },
  { title: "A", items: contacts.filter((contact) => contact.location === "A") },
  { title: "B", items: contacts.filter((contact) => contact.location === "B") },
  { title: "C", items: contacts.filter((contact) => contact.location === "C") },
  { title: "L", items: contacts.filter((contact) => contact.location === "L") },
]

const indexLetters = ["我", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"]

function AvatarDisc({ contact }: { contact: Contact }) {
  if (contact.id === "me") return null

  const palette = contact.id.charCodeAt(0) % 4
  const gradients = [
    "from-[#cfd7e9] to-[#8fa2c5] text-white",
    "from-[#f1d2aa] to-[#d88b48] text-white",
    "from-[#d9e5dd] to-[#8fb09f] text-white",
    "from-[#e5c3cf] to-[#c96d88] text-white",
  ]

  return (
    <div className={`grid size-[48px] shrink-0 place-items-center overflow-hidden rounded-full border border-[#d5d5d5] bg-linear-to-b ${gradients[palette]} text-[18px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]`}>
      {contact.name.slice(0, 1)}
    </div>
  )
}

function ContactRow({ contact }: { contact: Contact }) {
  const isProfile = contact.id === "me"

  return (
    <button
      className={`flex w-full items-center border-b border-[#e2e2e2] bg-[#fbfbfb] px-[18px] text-left active:bg-[#eeeeee] ${
        isProfile ? "h-[74px]" : "h-[72px]"
      }`}
      type="button"
    >
      <AvatarDisc contact={contact} />
      <div className={isProfile ? "text-[21px] text-[#9a9da2]" : "ml-4 text-[22px] text-[#111111]"}>
        {contact.name}
      </div>
    </button>
  )
}

function SortPopover() {
  const items = [
    { label: "名字", icon: "A", active: true },
    { label: "地点", icon: MapPin },
    { label: "联系频率", icon: ListFilter },
    { label: "添加时间", icon: "◷" },
  ]

  return (
    <div className="absolute right-[12px] top-[132px] z-40 w-[216px] rounded-[6px] border border-[#d6d6d6] bg-[#f7f7f7] text-[#555555] shadow-[0_8px_18px_rgba(0,0,0,0.16)]">
      <div className="absolute -top-[10px] right-[18px] size-5 rotate-45 border-l border-t border-[#d6d6d6] bg-[#f7f7f7]" />
      <div className="relative border-b border-[#e1e1e1] px-5 py-3 text-[15px] text-[#a1a4a9]">排列方式</div>
      {items.map((item) => {
        const Icon = typeof item.icon === "string" ? null : item.icon
        return (
          <button className="relative flex h-[54px] w-full items-center border-b border-[#e1e1e1] px-5 text-left last:border-b-0" key={item.label} type="button">
            <span className="mr-4 grid size-5 place-items-center rounded-full bg-[#c6c9ce] text-[12px] font-normal text-white">
              {Icon ? <Icon className="size-4" /> : item.icon}
            </span>
            <span className="text-[18px] font-medium">{item.label}</span>
            {item.active ? <Check className="ml-auto size-7 text-[#638bdc] stroke-[3px]" /> : null}
          </button>
        )
      })}
    </div>
  )
}

function SurnameOverlay() {
  const surnames = ["朗", "李", "黎", "林", "令", "刘", "路", "鲁", "罗", "吕"]

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[152px] z-30 flex justify-center">
      <div className="relative w-[300px] rounded-[4px] border border-[#d3d5d8] bg-[#f6f7f8] px-5 py-5 shadow-[0_5px_14px_rgba(0,0,0,0.14)]">
        <div className="grid grid-cols-8 gap-x-4 gap-y-4 text-center text-[21px] text-[#5c5f64]">
          {surnames.map((surname) => (
            <span key={surname}>{surname}</span>
          ))}
        </div>
        <div className="absolute -right-[8px] bottom-[-8px] size-5 rotate-45 border-b border-r border-[#d3d5d8] bg-[#f6f7f8]" />
      </div>
      <div className="absolute top-[-46px] left-1/2 ml-[-8px] grid size-[48px] place-items-center rounded-[5px] border border-[#d2d4d7] bg-[#f8f8f8] text-[25px] text-[#555555] shadow-[0_3px_8px_rgba(0,0,0,0.14)]">
        林
      </div>
    </div>
  )
}

function AlphabetGrid() {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "›"]

  return (
    <div className="absolute inset-y-[152px] right-[32px] z-20 grid w-[206px] grid-cols-3 border-l border-t border-[#d7d9dc] bg-[#eeeeef]/88 text-[#a4a7ac]">
      {letters.map((letter) => (
        <div className="grid place-items-center border-b border-r border-[#d7d9dc] text-[22px] font-medium" key={letter}>
          {letter === "›" ? <span className="grid size-8 place-items-center rounded-full border-2 border-[#a4a7ac] text-[28px] leading-none">›</span> : letter}
        </div>
      ))}
    </div>
  )
}

function ContactsScreen({ favoriteOnly = false }: { favoriteOnly?: boolean }) {
  const [mode, setMode] = useState<"normal" | "surname" | "sort">("normal")
  const sections = favoriteOnly
    ? [{ title: "收藏", items: contacts.filter((contact) => contact.favorite) }]
    : contactSections

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#f4f4f4]">
      <div className="flex h-[62px] items-center justify-between border-b border-[#c9ccd1] bg-[linear-gradient(180deg,#f8f8f8_0%,#e6e8eb_100%)] px-2.5 shadow-[inset_0_-3px_8px_rgba(0,0,0,0.08)]">
        <ToolbarButton>编辑</ToolbarButton>
        <SegmentedControl />
        <ToolbarButton>添加</ToolbarButton>
      </div>

      <div className="flex h-[58px] items-center gap-2 border-b border-[#c9ccd1] bg-[linear-gradient(180deg,#eeeeef,#dbdde1)] px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#9aa0a6]" />
          <input
            className="h-[34px] w-full rounded-full border border-[#c6c9ce] bg-white pl-10 pr-4 text-[15px] outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.10),0_1px_0_rgba(255,255,255,0.72)]"
            readOnly
          />
        </div>
        <button
          className="grid h-[38px] w-[45px] place-items-center border-l border-[#c2c5ca] text-[#8a8e95]"
          onClick={() => setMode(mode === "sort" ? "normal" : "sort")}
          type="button"
        >
          <ListFilter className="size-7 stroke-[2.5px]" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto bg-white pr-[22px]">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="h-[31px] border-b border-[#c7c9cc] bg-[linear-gradient(180deg,#dedfe2,#c5c8cd)] px-[13px] text-[18px] font-medium leading-[31px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              {section.title}
            </div>
            {section.items.map((contact) => (
              <ContactRow contact={contact} key={contact.id} />
            ))}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 right-0 top-[120px] z-20 flex w-[22px] flex-col items-center justify-around bg-[#f0f1f2]/80 py-1 text-[11px] font-normal text-[#a6a9ae]">
        {indexLetters.map((letter) => (
          <button
            className="grid size-[15px] place-items-center leading-none"
            key={letter}
            onClick={() => setMode(letter === "L" ? "surname" : "normal")}
            type="button"
          >
            {letter}
          </button>
        ))}
      </div>

      {mode === "surname" ? <AlphabetGrid /> : null}
      {mode === "surname" ? <SurnameOverlay /> : null}
      {mode === "sort" ? <SortPopover /> : null}
    </div>
  )
}


function RecentsScreen({ recents }: { recents: RecentCall[] }) {
  return (
    <SimpleListScreen title="通话记录">
      {recents.map((recent) => (
        <RecentRow compact key={recent.id} recent={recent} />
      ))}
    </SimpleListScreen>
  )
}

function CallScreen({ target, onEnd }: { target: string; onEnd: () => void }) {
  return (
    <div className="flex flex-1 flex-col bg-[#17191d] text-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="grid size-24 place-items-center rounded-full border border-white/10 bg-[#262a31] text-[34px] font-medium shadow-[inset_0_2px_6px_rgba(255,255,255,0.08),0_12px_28px_rgba(0,0,0,0.35)]">
          <Phone className="size-10 fill-white stroke-white" />
        </div>
        <div className="mt-6 text-[30px] font-medium tracking-[-0.015em]">{target || "未知号码"}</div>
        <div className="mt-2 text-[15px] text-white/45">正在呼叫...</div>
      </div>
      <div className="p-8">
        <button
          className="flex h-14 w-full items-center justify-center rounded-full bg-[#c9443e] text-[18px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_20px_rgba(0,0,0,0.25)] active:translate-y-px"
          onClick={onEnd}
          type="button"
        >
          结束通话
        </button>
      </div>
    </div>
  )
}

export default function SmartisanPhone() {
  const [activeTab, setActiveTab] = useState<TabId>("dialer")
  const [dialNumber, setDialNumber] = useState("")
  const [recents, setRecents] = useState(initialRecents)
  const [calling, setCalling] = useState(false)

  const callTarget = useMemo(() => {
    if (dialNumber) return dialNumber
    return recents[0]?.phone ?? ""
  }, [dialNumber, recents])

  const handleDigit = (digit: string) => {
    playDtmfTone(digit)
    setDialNumber((value) => value + digit)
  }

  const handleBackspace = () => {
    playDtmfTone("click")
    setDialNumber((value) => value.slice(0, -1))
  }

  const handleCall = () => {
    playDtmfTone("click")
    const target = callTarget || "未知号码"
    setRecents((value) => [
      {
        id: String(Date.now()),
        title: target,
        phone: target,
        location: "电话",
        time: "刚刚",
      },
      ...value,
    ])
    setCalling(true)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <div
        className="w-full max-w-[380px] overflow-hidden border border-[#c8c8c8] bg-[#f4f4f4] text-[#222222] shadow-[0_1px_3px_rgba(0,0,0,0.10),0_10px_26px_rgba(0,0,0,0.04)]"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        <div className="flex h-[680px] flex-col overflow-hidden bg-[#f4f4f4]">
          <StatusBar />

          {calling ? (
            <CallScreen target={callTarget} onEnd={() => setCalling(false)} />
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              {activeTab === "dialer" ? (
                <DialerScreen
                  dialNumber={dialNumber}
                  onBackspace={handleBackspace}
                  onCall={handleCall}
                  onDigit={handleDigit}
                  recents={recents}
                />
              ) : null}
              {activeTab === "recents" ? <RecentsScreen recents={recents} /> : null}
              {activeTab === "contacts" ? <ContactsScreen /> : null}
              {activeTab === "favorites" ? <ContactsScreen favoriteOnly /> : null}
            </div>
          )}

          {!calling ? <TabBar activeTab={activeTab} setActiveTab={setActiveTab} /> : null}
        </div>
      </div>
    </div>
  )
}
