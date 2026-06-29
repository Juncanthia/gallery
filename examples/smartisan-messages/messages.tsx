import {
  Battery,
  ChevronLeft,
  Mail,
  MessageCircle,
  Mic,
  Plus,
  Smile,
  UserRound,
  Wifi,
} from "lucide-react"

type ChatMessage = {
  id: string
  side: "left" | "right"
  text: string
  compact?: boolean
}

const messages: ChatMessage[] = [
  { id: "m1", side: "right", text: "好的，没问题。", compact: true },
  { id: "m2", side: "right", text: "我笔记本比较旧了，可能比较卡，没有关系吗" },
  { id: "m3", side: "left", text: "没事，主要是看看有没有BUG或者不兼容什么的。" },
  { id: "m4", side: "right", text: "好的，那我明天带过来吧😀" },
  { id: "m5", side: "right", text: "里面东西比较多不要介意😭" },
  { id: "m6", side: "left", text: "嘉耀，你觉得我们昨天晚上会上讨论的那几个创意怎么样？" },
  { id: "m7", side: "left", text: "能不能实现啊", compact: true },
  { id: "m8", side: "left", text: "如果可以的话，你们几个商量一下在明早之前最好给我一个方案出来，要具体一点的。" },
  { id: "m9", side: "left", text: "到时候我再看。", compact: true },
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
        洋哥
      </div>
      <DogAvatar className="absolute right-3 size-[42px]" />
    </div>
  )
}

function DogAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-full border border-white/80 bg-[#d6a763] shadow-[0_1px_2px_rgba(0,0,0,0.18)] ${className}`}>
      <div className="absolute inset-0 bg-radial from-[#efd19a] from-[0_22%] via-[#cc8845] via-[23%_58%] to-[#6d4a2d]" />
      <div className="absolute left-[24%] top-[18%] size-[11px] rounded-full bg-[#33251c]" />
      <div className="absolute right-[24%] top-[18%] size-[11px] rounded-full bg-[#33251c]" />
      <div className="absolute left-1/2 top-[42%] size-[9px] -translate-x-1/2 rounded-full bg-[#2a1b13]" />
      <div className="absolute bottom-[7%] left-1/2 h-[13px] w-[28px] -translate-x-1/2 rounded-t-full bg-[#efe2c6]" />
    </div>
  )
}

function PenguinAvatar() {
  return (
    <div className="relative size-[44px] overflow-hidden rounded-full bg-[#f7fbff] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
      <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_50%_-20%,#18bff0_0_4px,transparent_5px_11px)] opacity-90" />
      <div className="absolute left-1/2 top-[12px] h-[28px] w-[26px] -translate-x-1/2 rounded-t-full rounded-b-[12px] bg-[#202020]" />
      <div className="absolute left-[12px] top-[22px] h-[15px] w-[20px] rounded-full bg-white" />
      <div className="absolute left-[15px] top-[18px] size-[4px] rounded-full bg-white" />
      <div className="absolute right-[15px] top-[18px] size-[4px] rounded-full bg-white" />
      <div className="absolute left-1/2 top-[22px] h-[5px] w-[10px] -translate-x-1/2 rounded-full bg-[#f5c04d]" />
    </div>
  )
}

function BubbleTail({ side }: { side: ChatMessage["side"] }) {
  if (side === "right") {
    return (
      <span className="absolute right-[-8px] top-[14px] h-[14px] w-[10px] overflow-hidden">
        <span className="absolute left-[-8px] top-0 size-[14px] rotate-45 border border-[#bcd7f5] bg-[#e8f3ff]" />
      </span>
    )
  }

  return (
    <span className="absolute left-[-8px] top-[14px] h-[14px] w-[10px] overflow-hidden">
      <span className="absolute right-[-8px] top-0 size-[14px] rotate-45 border border-[#dbdedf] bg-[#fdfefe]" />
    </span>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isRight = message.side === "right"

  return (
    <div className={`mb-[16px] flex items-start gap-2 ${isRight ? "justify-end pl-14" : "justify-start pr-12"}`}>
      {!isRight ? <DogAvatar className="mt-[-2px] size-[44px] shrink-0" /> : null}
      <div
        className={`relative rounded-[7px] border px-4 py-3 text-[18px] font-normal leading-[30px] tracking-[-0.04em] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${
          message.compact ? "max-w-[224px]" : "max-w-[268px]"
        } ${
          isRight
            ? "border-[#bcd7f5] bg-[#e8f3ff] text-[#3c7ed1]"
            : "border-[#dbdedf] bg-[#fdfefe] text-[#777b80]"
        }`}
      >
        <BubbleTail side={message.side} />
        {message.text}
      </div>
      {isRight ? <PenguinAvatar /> : null}
    </div>
  )
}

function VoiceOverlay() {
  return (
    <div className="absolute right-7 bottom-[80px] z-20 w-[250px] rounded-[11px] border border-[#89bdec] bg-linear-to-b from-[#4aa7fb] to-[#3b98ee] text-white shadow-[0_3px_10px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.3)]">
      <div className="px-5 pt-4 text-[17px] font-normal tracking-[-0.04em]">好的我们已经开始做了明天</div>
      <div className="relative mt-3 h-[36px] overflow-hidden border-y border-white/20 bg-[#439ceb]">
        <div className="absolute right-3 top-1/2 h-[22px] w-[96px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(190,223,255,0.75)_0_3px,transparent_3px_7px)] [clip-path:polygon(0_50%,6%_44%,12%_52%,18%_35%,24%_61%,30%_25%,36%_70%,42%_34%,48%_56%,54%_40%,60%_63%,66%_27%,72%_58%,78%_38%,84%_66%,90%_31%,100%_51%,100%_100%,0_100%)]" />
      </div>
      <div className="grid h-[54px] grid-cols-2 text-[17px] font-medium">
        <button className="border-r border-[#2e83d9]" type="button">取消</button>
        <button type="button">说完了</button>
      </div>
      <span className="absolute right-8 bottom-[-8px] size-[16px] rotate-45 border-r border-b border-[#89bdec] bg-[#3b98ee]" />
    </div>
  )
}

function InputBar() {
  return (
    <div className="relative flex h-[62px] items-center gap-2 border-t border-[#e3e5e7] bg-linear-to-b from-[#fbfbfb] to-[#f6f7f8] px-3 shadow-[inset_0_1px_0_#fff]">
      <button className="flex size-[38px] items-center justify-center rounded-full border border-[#d7dadf] bg-white text-[#9aa0a7] shadow-[inset_0_1px_0_#fff]" type="button">
        <Smile className="size-[23px]" />
      </button>
      <div className="h-[38px] flex-1 rounded-[8px] border border-[#dce0e4] bg-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]" />
      <button className="flex size-[42px] items-center justify-center rounded-full border border-[#6f96e9] bg-linear-to-b from-[#78a4ff] to-[#5276e9] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.16)]" type="button">
        <Mic className="size-[23px] fill-white stroke-white" />
      </button>
      <button className="flex size-[38px] items-center justify-center rounded-full border border-[#d7dadf] bg-white text-[#8f959c] shadow-[inset_0_1px_0_#fff]" type="button">
        <Plus className="size-[25px]" />
      </button>
    </div>
  )
}

export default function SmartisanMessages() {
  return (
    <div className="flex w-full flex-col items-center px-2 py-4">
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-[3px] border border-[#1d1d1d] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="relative flex h-[760px] flex-col bg-white">
          <StatusBar />
          <Header />
          <div className="min-h-0 flex-1 overflow-hidden bg-white px-3 pt-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          <VoiceOverlay />
          <InputBar />
        </div>
      </div>
    </div>
  )
}
