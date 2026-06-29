import {
  Battery,
  ChevronDown,
  ChevronLeft,
  Check,
  Image,
  Keyboard,
  Mail,
  Mic,
  MessageCircle,
  Smile,
  Star,
  Sun,
  UserRound,
  Wifi,
} from "lucide-react"
import type { ReactNode } from "react"

function StatusBar({ brown = false }: { brown?: boolean }) {
  return (
    <div className={`flex h-[30px] items-center justify-between px-2.5 text-white ${brown ? "bg-[#786452]" : "bg-[#f5f5f5] text-[#555]"}`}>
      <div className="flex items-center gap-1.5 opacity-95">
        <UserRound className="size-[13px] fill-current stroke-current" />
        <MessageCircle className="size-[15px] fill-current stroke-current" />
        <Mail className="size-[15px] stroke-[2.4px]" />
      </div>
      <div className="text-[14px] font-medium leading-none tracking-normal">7:30PM</div>
      <div className="flex items-center gap-1.5 opacity-95">
        <Wifi className="size-[15px] stroke-[2.6px]" />
        <div className="flex h-4 items-end gap-[2px]">
          {[6, 8, 10, 12].map((height) => (
            <span className="w-[3px] rounded-[1px] bg-current" key={height} style={{ height }} />
          ))}
        </div>
        <Battery className="size-[19px] stroke-[2px]" />
      </div>
    </div>
  )
}

function PhoneScreen({ children }: { children: ReactNode }) {
  return (
    <div className="w-[360px] shrink-0 overflow-hidden rounded-[3px] border border-[#232323] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
      <div className="flex h-[640px] flex-col">{children}</div>
    </div>
  )
}

function SoftButton({ children }: { children: ReactNode }) {
  return (
    <button className="flex h-[36px] items-center rounded-[4px] border border-[#d4d6da] bg-linear-to-b from-white to-[#eef0f2] px-3 text-[14px] font-normal text-[#777d84] shadow-[inset_0_1px_0_#fff]" type="button">
      {children}
    </button>
  )
}

function SettingsHeader() {
  return (
    <div className="flex h-[58px] items-center border-b border-[#dedfe2] bg-linear-to-b from-[#ffffff] to-[#f1f2f4] px-2 shadow-[inset_0_1px_0_#fff]">
      <SoftButton>
        <ChevronLeft className="mr-1 size-[16px]" />
        Smarti...
      </SoftButton>
      <div className="flex-1 text-center text-[21px] font-medium tracking-[-0.04em] text-[#5f656d]">词库与语音设置</div>
      <div className="w-[78px]" />
    </div>
  )
}

function SettingsGroup({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 overflow-hidden rounded-[5px] border border-[#e1e3e6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  )
}

function SettingsRow({ title, value, checked, arrow = false, switcher = false }: { title: string; value?: string; checked?: boolean; arrow?: boolean; switcher?: boolean }) {
  return (
    <button className="flex h-[54px] w-full items-center border-b border-[#eceef0] px-4 text-left last:border-b-0" type="button">
      <span className="min-w-0 flex-1 truncate text-[17px] font-normal tracking-[-0.04em] text-[#50565d]">{title}</span>
      {value ? <span className="mr-2 text-[12px] text-[#8c9298]">{value}</span> : null}
      {checked ? <Check className="size-[18px] text-[#5f8dff] stroke-[3px]" /> : null}
      {switcher ? <SmallSwitch /> : null}
      {arrow ? <span className="text-[28px] leading-none text-[#b8bdc2]">›</span> : null}
    </button>
  )
}

function SmallSwitch() {
  return (
    <span className="relative inline-flex h-[28px] w-[54px] items-center rounded-full border border-[#e1e4e8] bg-linear-to-b from-[#ffffff] to-[#f6f7f8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.07)]">
      <span className="ml-[25px] size-[26px] rounded-full border border-[#d8dadd] bg-linear-to-b from-white to-[#f0f1f2] shadow-[0_4px_10px_rgba(0,0,0,0.13)]" />
      <span className="absolute left-[10px] size-[8px] rounded-full bg-[#7ca4ff]" />
    </span>
  )
}

function VoiceSettingsScreen() {
  return (
    <PhoneScreen>
      <StatusBar />
      <SettingsHeader />
      <div className="min-h-0 flex-1 overflow-hidden bg-[linear-gradient(90deg,rgba(255,255,255,0.9),rgba(244,246,248,0.84)),repeating-linear-gradient(90deg,rgba(0,0,0,0.025)_0,rgba(0,0,0,0.025)_1px,transparent_1px,transparent_4px)] px-4 pt-4">
        <div className="mb-2 px-4 text-[12px] font-normal text-[#9a9fa5]">词库选择</div>
        <SettingsGroup>
          <SettingsRow checked title="搜狗词库" />
          <SettingsRow title="讯飞词库" />
        </SettingsGroup>
        <div className="mb-2 px-4 text-[12px] font-normal text-[#9a9fa5]">语音输入选择</div>
        <SettingsGroup>
          <SettingsRow title="搜狗语音技术" />
          <SettingsRow checked title="讯飞语音技术" />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsRow arrow title="语音识别语种" value="普通话" />
        </SettingsGroup>
        <SettingsGroup>
          <SettingsRow switcher title="匹配本机联系人" />
        </SettingsGroup>
        <p className="px-4 text-[12px] leading-[19px] text-[#8e949a]">每天 0 时自动更新一次本机联系人，如果你在 24h 内添加了新联系人，想尽快通过语音搜索到，可点击下方的按钮，手动导入联系人</p>
        <button className="mt-5 h-[50px] w-full rounded-[5px] border border-[#e1e3e6] bg-white text-[17px] font-normal tracking-[-0.04em] text-[#686e75] shadow-[0_1px_2px_rgba(0,0,0,0.08)]" type="button">手动导入联系人</button>
      </div>
    </PhoneScreen>
  )
}

function EditorHeader() {
  return (
    <div className="flex h-[58px] items-center border-b border-[#5c4736] bg-linear-to-b from-[#8b745f] to-[#6f5948] px-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
      <button className="flex h-[36px] items-center rounded-[4px] border border-[#5d4838] bg-linear-to-b from-[#846d5a] to-[#655040] px-3 text-[15px] font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]" type="button">
        <ChevronLeft className="mr-1 size-[16px]" />
        列表
      </button>
      <div className="ml-auto flex gap-2">
        <IconButton><Image className="size-[17px]" /></IconButton>
        <IconButton><Sun className="size-[17px]" /></IconButton>
        <IconButton><Check className="size-[18px] stroke-[3px]" /></IconButton>
      </div>
    </div>
  )
}

function IconButton({ children }: { children: ReactNode }) {
  return (
    <button className="flex h-[34px] min-w-[42px] items-center justify-center rounded-[4px] border border-[#5d4838] bg-linear-to-b from-[#846d5a] to-[#655040] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]" type="button">{children}</button>
  )
}

function NotePaper({ text, empty = false }: { text?: string; empty?: boolean }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-[#fcfbec]">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_43px,rgba(116,91,58,0.09)_44px,transparent_45px),linear-gradient(90deg,rgba(210,82,60,0.08)_0_1px,transparent_1px)] bg-[length:100%_44px,44px_100%]" />
      <div className="relative flex h-[32px] items-center px-8 text-[10px] text-[#d4b894]">
        <button className="mr-2 rounded-[3px] border border-[#eadfc9] bg-[#fff8e6] px-2 py-0.5">全部便签</button>
        <span>今天 下午7:30</span>
        <span className="ml-4">{empty ? "0" : "21"}</span>
        <Star className="ml-auto size-[18px] fill-[#efe3cf] stroke-[#efe3cf]" />
        <span className="ml-3 rounded-[2px] bg-[#f6d29a] px-1 text-[9px] text-[#bf8650]">RTF</span>
        <ChevronDown className="ml-2 size-[12px]" />
      </div>
      {!empty ? (
        <div className="relative px-8 pt-7 text-[16px] font-normal leading-[28px] tracking-[-0.03em] text-[#8c5b45]">
          {text}
        </div>
      ) : null}
    </div>
  )
}

function FormatToolbar() {
  const tools = ["H\n标题", "≡\n居中", "☷\n列表", "B\n粗体", "“\n引用", "☑\n待办事项"]
  return (
    <div className="grid h-[43px] grid-cols-6 border-y border-[#efd8ae] bg-[#fff1d2] text-[#e1b46a]">
      {tools.map((tool) => (
        <button className="whitespace-pre-line border-r border-[#edd19f] text-[10px] font-medium last:border-r-0" key={tool} type="button">{tool}</button>
      ))}
    </div>
  )
}

function InputModeBar() {
  const items = [Keyboard, MessageCircle, Mic, Smile, ChevronDown]
  return (
    <div className="grid h-[46px] grid-cols-5 border-b border-[#d8dcde] bg-linear-to-b from-[#f9fbfb] to-[#eef1f1]">
      {items.map((Icon, index) => (
        <button className="flex items-center justify-center" key={index} type="button">
          <Icon className="size-[22px] text-[#737a7c]" />
        </button>
      ))}
    </div>
  )
}

function QwertyKeyboard() {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["分词", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ["中\n/En", "123", ",", "空格", "。", "#+=", "↵"],
  ]

  return (
    <div className="bg-[#edf0f0] px-2 pb-2 pt-2 shadow-[inset_0_1px_0_#fff]">
      <div className="mb-2 grid grid-cols-10 gap-1.5">
        {rows[0].map((key) => <KeyButton key={key}>{key}</KeyButton>)}
      </div>
      <div className="mb-2 grid grid-cols-9 gap-1.5 px-[17px]">
        {rows[1].map((key) => <KeyButton key={key}>{key}</KeyButton>)}
      </div>
      <div className="mb-2 grid grid-cols-[1.25fr_repeat(7,1fr)_1.25fr] gap-1.5">
        {rows[2].map((key) => <KeyButton key={key}>{key}</KeyButton>)}
      </div>
      <div className="grid grid-cols-[1.2fr_1.15fr_.8fr_1.6fr_.8fr_1.15fr_1.2fr] gap-1.5">
        {rows[3].map((key) => <KeyButton key={key}>{key}</KeyButton>)}
      </div>
    </div>
  )
}

function KeyButton({ children }: { children: ReactNode }) {
  return (
    <button className="h-[48px] whitespace-pre-line rounded-[4px] border border-[#cfd4d4] bg-linear-to-b from-[#ffffff] to-[#f5f7f7] text-[19px] font-normal leading-[21px] tracking-[-0.03em] text-[#686e70] shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_#fff] active:translate-y-px" type="button">{children}</button>
  )
}

function EditorScreen({ empty = false }: { empty?: boolean }) {
  return (
    <PhoneScreen>
      <StatusBar brown />
      <EditorHeader />
      <NotePaper empty={empty} text="使用语音输入法，可以大幅度提升你的工作效率" />
      <FormatToolbar />
      <InputModeBar />
      <QwertyKeyboard />
    </PhoneScreen>
  )
}

export default function SmartisanNoteInputSuite() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <div
        className="mx-auto flex min-w-[1120px] justify-center gap-8"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <VoiceSettingsScreen />
        <EditorScreen />
        <EditorScreen empty />
      </div>
    </div>
  )
}
