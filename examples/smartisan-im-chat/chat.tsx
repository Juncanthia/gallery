import {
  Battery,
  ChevronLeft,
  Mail,
  MessageCircle,
  Mic,
  Smile,
  UserRound,
  Wifi,
  X,
} from "lucide-react"

type ChatMessage = {
  id: string
  text: string
  compact?: boolean
}

const messages: ChatMessage[] = [
  {
    id: "m1",
    text: "关于子弹短信的一句话介绍，我写了几个文案，你看下用哪个？",
  },
  {
    id: "m2",
    text: "子弹短信，一款超高效率的即时通讯软件",
  },
  {
    id: "m3",
    text: "子弹短信，一款次世代的即时通讯软件",
  },
  {
    id: "m4",
    text: "子弹短信，嗖的一下消息就发出去了",
  },
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
    <div className="relative flex h-[56px] items-center border-b border-[#177bd2] bg-linear-to-b from-[#58b2ff] via-[#3699ee] to-[#2188de] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
      <button
        className="flex h-[38px] items-center rounded-[4px] border border-[#1d7dce] bg-linear-to-b from-[#54adfb] to-[#2a8fe3] px-2.5 text-[18px] font-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
        type="button"
      >
        <ChevronLeft className="mr-0.5 size-[20px] stroke-[2.8px]" />
        返回
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 text-[29px] font-normal tracking-[-0.05em] text-white [text-shadow:0_-1px_0_rgba(0,0,0,0.22)]">
        王松年
      </div>
      <PortraitAvatar className="absolute right-3 size-[42px]" />
    </div>
  )
}

function PortraitAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-full border border-white/80 bg-[#d8b0c4] shadow-[0_1px_2px_rgba(0,0,0,0.18)] ${className}`}>
      <div className="absolute inset-0 bg-radial from-[#f4d7e4] from-[0_22%] via-[#b47491] via-[23%_58%] to-[#5b3349]" />
      <div className="absolute left-1/2 top-[7px] size-[17px] -translate-x-1/2 rounded-full bg-[#f5e8dc]" />
      <div className="absolute left-1/2 top-[23px] h-[20px] w-[28px] -translate-x-1/2 rounded-t-full bg-[#f5e8dc]" />
      <div className="absolute left-[9px] top-[2px] h-[24px] w-[26px] rounded-full bg-[#6b2d46]/45" />
    </div>
  )
}

function BubbleTail() {
  return (
    <span className="absolute left-[-8px] top-[14px] h-[14px] w-[10px] overflow-hidden">
      <span className="absolute right-[-8px] top-0 size-[14px] rotate-45 border border-[#dbdedf] bg-[#fdfefe]" />
    </span>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="mb-[16px] flex items-start gap-3 pr-8">
      <PortraitAvatar className="mt-[-2px] size-[42px] shrink-0" />
      <div
        className={`relative rounded-[7px] border border-[#dbdedf] bg-[#fdfefe] px-4 py-3 text-[19px] font-normal leading-[31px] tracking-[-0.05em] text-[#777b80] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
          message.compact ? "max-w-[248px]" : "max-w-[274px]"
        }`}
      >
        <BubbleTail />
        {message.text}
      </div>
    </div>
  )
}

function ReplyBar() {
  return (
    <div className="flex h-[54px] items-center border-t border-[#e3e5e7] bg-[#fbfbfb] px-4 text-[15px] font-normal tracking-[-0.04em] text-[#a7adb3]">
      <span className="mr-1 text-[22px] leading-none text-[#c4c8cd]">“</span>
      <span className="mr-1 font-medium">回复: 王松年</span>
      <span className="min-w-0 flex-1 truncate">子弹短信，一款次世代的即时通讯软件</span>
      <X className="ml-2 size-[20px] shrink-0 text-[#9ea4aa] stroke-[3px]" />
    </div>
  )
}

function InputBar() {
  return (
    <div className="flex h-[58px] items-center gap-2 border-t border-[#e3e5e7] bg-linear-to-b from-[#fbfbfb] to-[#f6f7f8] px-3 shadow-[inset_0_1px_0_#fff]">
      <button className="flex size-[38px] items-center justify-center rounded-full border border-[#d7dadf] bg-white text-[#9aa0a7] shadow-[inset_0_1px_0_#fff]" type="button">
        <Smile className="size-[23px]" />
      </button>
      <div className="flex h-[38px] flex-1 items-center rounded-[8px] border border-[#dce0e4] bg-white px-3 text-[19px] font-normal text-[#4f555b] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
        OK<span className="ml-[1px] h-[24px] w-px bg-[#7f858b]" />
      </div>
      <button className="flex size-[42px] items-center justify-center rounded-full border border-[#6f96e9] bg-linear-to-b from-[#78a4ff] to-[#5276e9] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.16)]" type="button">
        <Mic className="size-[23px] fill-white stroke-white" />
      </button>
      <button className="flex size-[42px] items-center justify-center rounded-full border border-[#7ecf3e] bg-linear-to-b from-[#91d955] to-[#64bf32] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.16)]" type="button">
        <span className="ml-0.5 h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-white" />
      </button>
    </div>
  )
}

function CandidateBar() {
  const candidates = ["了", "啦", "不", "的", "吗", "啊", "谢谢"]

  return (
    <div className="grid h-[58px] grid-cols-[repeat(7,1fr)_48px] border-t border-[#d4d7da] bg-linear-to-b from-[#f5f7f7] to-[#eef1f1]">
      {candidates.map((item) => (
        <button className="border-r border-[#e0e3e4] text-[25px] font-normal text-[#6e7478]" key={item} type="button">
          {item}
        </button>
      ))}
      <button className="flex items-center justify-center bg-[#72787a] text-white" type="button">
        <X className="size-[21px] stroke-[3px]" />
      </button>
    </div>
  )
}

function Keyboard() {
  const rows = [
    ["，\n—\n。\n—\n?\n—\n!", "分词", "ABC", "DEF", "⌫"],
    ["", "GHI", "JKL", "MNO", "重输"],
    ["", "PQRS", "TUV", "WXYZ", "0"],
    ["中\n/En", "123", "空格", "#+=", "↵"],
  ]

  return (
    <div className="grid h-[254px] grid-cols-[58px_1fr_1fr_1fr_58px] gap-[4px] bg-[#edf0f0] p-[8px] pt-[10px] shadow-[inset_0_1px_0_#fff]">
      {rows.flatMap((row, rowIndex) =>
        row.map((key, columnIndex) => {
          const tallLeft = columnIndex === 0 && rowIndex === 0
          const blankLeft = columnIndex === 0 && (rowIndex === 1 || rowIndex === 2)
          if (blankLeft) return <div key={`${rowIndex}-${columnIndex}`} />

          return (
            <button
              className={`whitespace-pre-line rounded-[4px] border border-[#cfd4d4] bg-linear-to-b from-[#ffffff] to-[#f5f7f7] text-[23px] font-normal leading-[29px] tracking-[-0.03em] text-[#686e70] shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_#fff] active:translate-y-px ${
                tallLeft ? "row-span-3" : ""
              }`}
              key={`${rowIndex}-${columnIndex}`}
              type="button"
            >
              {key}
            </button>
          )
        })
      )}
    </div>
  )
}

export default function SmartisanIMChat() {
  return (
    <div className="flex w-full flex-col items-center px-2 py-4">
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-[3px] border border-[#1d1d1d] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="relative flex h-[760px] flex-col bg-white">
          <StatusBar />
          <Header />
          <div className="min-h-0 flex-1 overflow-hidden bg-white px-4 pt-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          <ReplyBar />
          <InputBar />
          <CandidateBar />
          <Keyboard />
        </div>
      </div>
    </div>
  )
}
