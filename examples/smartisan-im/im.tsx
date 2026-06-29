import {
  Battery,
  BookOpen,
  ChevronRight,
  FileText,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Search,
  Star,
  UserRound,
  UsersRound,
  Wifi,
} from "lucide-react"

type Conversation = {
  title: string
  preview: string
  time: string
  avatar: "group" | "t" | "corner" | "girl" | "man" | "dog" | "red" | "balloon" | "emoji"
  muted?: boolean
  unread?: boolean
  expanded?: boolean
}

const conversations: Conversation[] = [
  { title: "快如-子弹-订餐-扯淡-沟通", preview: "于礼: [语音消息]", time: "18:58", avatar: "group", unread: true },
  { title: "子弹大产品组", preview: "王松年: 咱们的图还没改啊", time: "16:48", avatar: "group", unread: true },
  { title: "锤友联盟", preview: "罗根生: [语音消息]", time: "19:29", avatar: "t", unread: true, muted: true, expanded: true },
  { title: "bullet-englishcorner", preview: "Jathan: not end. usually 2nd and 3rd week of", time: "19:24", avatar: "corner", unread: true, muted: true, expanded: true },
  { title: "王松年", preview: "我: OK", time: "21:53", avatar: "girl" },
  { title: "郝希杰", preview: "我们看一看他有没有什么好的交互可以学习", time: "18:53", avatar: "man" },
  { title: "洋哥", preview: "好的，我们已经开始做了，大概明天下班之前发给你。", time: "18:32", avatar: "dog" },
  { title: "志同道合", preview: "如鲸向海: 👨🏻‍🏫", time: "17:12", avatar: "red", muted: true },
  { title: "壁纸-美图", preview: "罗根生: 不错，这个可以留着", time: "16:52", avatar: "balloon" },
  { title: "咕咕咕", preview: "Ls撤回了一条消息", time: "16:42", avatar: "emoji" },
]

function StatusBar() {
  return (
    <div className="flex h-[30px] items-center justify-between bg-[#050505] px-2.5 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.12)]">
      <div className="flex items-center gap-1.5 opacity-95">
        <UserRound className="size-[14px] fill-white stroke-white" />
        <MessageCircle className="size-[15px] fill-white stroke-white" />
        <Mail className="size-[16px] stroke-[2.4px]" />
      </div>
      <div className="text-[16px] font-medium leading-none tracking-normal text-white">7:30PM</div>
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

function Header() {
  return (
    <div className="flex h-[58px] items-center border-b border-[#247fd2] bg-linear-to-b from-[#5db6ff] via-[#409ff1] to-[#2b8ce4] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
      <button className="flex h-[40px] min-w-[48px] items-center justify-center rounded-[4px] border border-[#2482d5] bg-linear-to-b from-[#61b9ff] to-[#3294e8] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]" type="button">
        <Menu className="mr-1 size-[18px]" />
        <Mic className="size-[16px] fill-white stroke-white" />
      </button>
      <div className="mx-auto flex h-[40px] overflow-hidden rounded-[5px] border border-[#247fce] bg-[#3e9ded] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
        <button className="min-w-[86px] bg-linear-to-b from-[#56aff8] to-[#2f8fe2] px-3 text-[18px] font-normal text-white" type="button">所有消息</button>
        <button className="min-w-[86px] border-l border-[#257fd1] px-3 text-[18px] font-normal text-[#d8efff]" type="button">稍后处理</button>
      </div>
      <button className="flex h-[40px] min-w-[50px] items-center justify-center rounded-[4px] border border-[#2482d5] bg-linear-to-b from-[#61b9ff] to-[#3294e8] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]" type="button">
        <MoreHorizontal className="size-[24px]" />
      </button>
    </div>
  )
}

function SearchBar() {
  return (
    <div className="flex h-[78px] items-center border-b border-[#dadddf] bg-linear-to-b from-[#f7f9fa] to-[#eef1f2] px-2">
      <div className="flex h-[48px] w-full items-center rounded-[24px] border border-[#d2d6da] bg-white px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]">
        <Search className="mr-3 size-[25px] text-[#c3c8cd]" />
        <span className="text-[18px] font-normal text-[#c9cdd1]">全局搜索</span>
      </div>
    </div>
  )
}

function ManagementRow() {
  return (
    <button className="flex h-[66px] w-full items-center justify-between border-b border-[#e4e6e8] bg-[#f7f9f9] px-4 text-left" type="button">
      <span className="text-[19px] font-medium tracking-[-0.03em] text-[#a1a7ad]">多端登录管理</span>
      <ChevronRight className="size-[22px] text-[#b7bcc1]" />
    </button>
  )
}

function Avatar({ type }: { type: Conversation["avatar"] }) {
  if (type === "group") {
    return (
      <div className="grid size-[54px] grid-cols-3 gap-[2px] overflow-hidden rounded-full border border-[#d6dade] bg-white p-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
        {Array.from({ length: 9 }).map((_, index) => (
          <span className="rounded-full" key={index} style={{ backgroundColor: ["#d7a38d", "#9fc6e3", "#d4c2a2", "#78a875", "#e1a0bd"][index % 5] }} />
        ))}
      </div>
    )
  }

  if (type === "t" || type === "red") {
    return (
      <div className="flex size-[54px] items-center justify-center rounded-full bg-[#d71920] text-[34px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        T
      </div>
    )
  }

  if (type === "dog") {
    return (
      <div className="relative size-[54px] overflow-hidden rounded-full border border-[#d6dade] bg-radial from-[#f1d19a] from-[0_22%] via-[#ca8746] via-[23%_58%] to-[#6f4a2d] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
        <span className="absolute left-[24%] top-[20%] size-[7px] rounded-full bg-[#33251c]" />
        <span className="absolute right-[24%] top-[20%] size-[7px] rounded-full bg-[#33251c]" />
        <span className="absolute left-1/2 top-[43%] size-[7px] -translate-x-1/2 rounded-full bg-[#2a1b13]" />
      </div>
    )
  }

  if (type === "emoji") {
    return <div className="flex size-[54px] items-center justify-center rounded-full border border-[#e3e5e8] bg-white text-[28px]">🤔</div>
  }

  if (type === "balloon") {
    return <div className="flex size-[54px] items-center justify-center rounded-full border border-[#e3e5e8] bg-radial from-[#ffea4f] to-[#e96a5a] text-[24px]">🎈</div>
  }

  const gradient = type === "corner" ? "from-[#fff2bf] via-[#e88b3d] to-[#333]" : type === "girl" ? "from-[#f4d6e3] via-[#af7287] to-[#58354a]" : "from-[#e5e8ec] via-[#9aa7b2] to-[#26313b]"

  return (
    <div className={`size-[54px] rounded-full border border-[#d6dade] bg-linear-to-b ${gradient} shadow-[0_1px_2px_rgba(0,0,0,0.12)]`}>
      <div className="mx-auto mt-2 size-[18px] rounded-full bg-white/85" />
      <div className="mx-auto mt-1 h-[24px] w-[32px] rounded-t-full bg-white/80" />
    </div>
  )
}

function ConversationRow({ item }: { item: Conversation }) {
  return (
    <div className="grid h-[84px] grid-cols-[72px_1fr_54px] border-b border-[#e8eaec] bg-white">
      <div className="relative flex items-center justify-center border-r border-[#ebedef]">
        <Avatar type={item.avatar} />
        {item.unread ? <span className="absolute right-0 top-[30px] flex size-[13px] items-center justify-center rounded-full bg-[#ffd72f] text-[9px] text-white shadow-[0_1px_1px_rgba(0,0,0,0.18)]">★</span> : null}
      </div>
      <div className="min-w-0 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="min-w-0 truncate text-[20px] font-medium leading-[25px] tracking-[-0.03em] text-[#35393e]">{item.title}</div>
          {item.unread ? <span className="size-[9px] shrink-0 rounded-full bg-[#6fa6ff]" /> : null}
          {item.muted ? <span className="text-[17px] text-[#c7cbd0]">♩</span> : null}
          {item.expanded ? <span className="text-[18px] text-[#b7bcc1]">⌄</span> : null}
        </div>
        <div className="mt-1 flex min-w-0 items-center gap-2">
          <div className="min-w-0 flex-1 truncate text-[17px] font-normal leading-[24px] tracking-[-0.03em] text-[#969ba1]">{item.preview}</div>
          <div className="shrink-0 text-[14px] font-normal text-[#e0e3e6]">{item.time}</div>
        </div>
      </div>
      <button className="flex items-center justify-center border-l border-[#e5edf4] bg-[#f3f9ff]" type="button">
        <Mic className="size-[23px] fill-[#69b5ff] stroke-[#69b5ff]" />
      </button>
    </div>
  )
}

function Toast() {
  return (
    <div className="absolute left-1/2 bottom-[102px] z-20 flex h-[66px] w-[218px] -translate-x-1/2 items-center justify-center rounded-[6px] border border-[#e4cf9d] bg-linear-to-b from-[#fffdf6] to-[#fff1cc] text-[18px] font-normal tracking-[-0.03em] text-[#a1763e] shadow-[0_8px_22px_rgba(0,0,0,0.16),inset_0_1px_0_#fff]">
      已添加至稍后处理
    </div>
  )
}

function TabBar() {
  const tabs = [
    { label: "对话", icon: MessageCircle, active: true },
    { label: "通讯录", icon: UsersRound },
    { label: "资讯流", icon: FileText },
    { label: "收藏", icon: BookOpen },
    { label: "个人中心", icon: UserRound },
  ]

  return (
    <div className="grid h-[74px] grid-cols-5 border-t border-[#dfe2e5] bg-white/95 shadow-[inset_0_1px_0_#fff]">
      {tabs.map(({ label, icon: Icon, active }) => (
        <button className="flex flex-col items-center justify-center gap-1 text-[12px] font-normal text-[#84898f]" key={label} type="button">
          <Icon className={`size-[28px] ${active ? "text-[#6d91ff]" : "text-[#cdd1d5]"}`} />
          <span className={active ? "text-[#5578e7]" : "text-[#747a82]"}>{label}</span>
        </button>
      ))}
    </div>
  )
}

export default function SmartisanIM() {
  return (
    <div className="flex w-full flex-col items-center px-2 py-4">
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-[3px] border border-[#1d1d1d] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="relative flex h-[760px] flex-col bg-white">
          <StatusBar />
          <Header />
          <SearchBar />
          <ManagementRow />
          <div className="min-h-0 flex-1 overflow-hidden bg-white">
            {conversations.map((item) => (
              <ConversationRow item={item} key={item.title} />
            ))}
          </div>
          <Toast />
          <TabBar />
        </div>
      </div>
    </div>
  )
}
