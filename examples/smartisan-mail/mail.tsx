import { useState } from "react"
import {
  Archive,
  Battery,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flag,
  Forward,
  Mail,
  Paperclip,
  Reply,
  ReplyAll,
  Send,
  Trash2,
  Wifi,
} from "lucide-react"

type MailView = "compose" | "read" | "attachment"

type TokenTone = "blue" | "green"

function StatusBar() {
  return (
    <div className="flex h-[30px] items-center justify-between bg-[#1c1c1c] px-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-1.5 opacity-95">
        <Mail className="size-[15px] stroke-[2.4px]" />
        <span className="h-[7px] w-[7px] rounded-full bg-white/90" />
        <span className="h-[7px] w-[7px] rounded-full bg-white/90" />
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

function BevelButton({
  children,
  className = "",
  tone = "gray",
}: {
  children: React.ReactNode
  className?: string
  tone?: "gray" | "blue" | "red"
}) {
  const toneClass = {
    gray:
      "border-[#b9babd] bg-linear-to-b from-[#fbfbfc] via-[#e7e8eb] to-[#c9cbd0] text-[#3f4248] shadow-[inset_0_1px_0_#fff,0_1px_1px_rgba(0,0,0,0.18)]",
    blue:
      "border-[#3277b8] bg-linear-to-b from-[#62b8f4] via-[#2995e0] to-[#0874c2] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_1px_rgba(0,0,0,0.18)]",
    red:
      "border-[#a44843] bg-linear-to-b from-[#f1867e] via-[#dc584f] to-[#b63632] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_1px_rgba(0,0,0,0.2)]",
  }[tone]

  return (
    <button
      className={`flex h-[29px] min-w-[48px] items-center justify-center rounded-[4px] border px-2 text-[13px] font-normal leading-none active:translate-y-px ${toneClass} ${className}`}
      type="button"
    >
      {children}
    </button>
  )
}

function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[45px] items-center justify-between border-b border-[#bfc0c2] bg-linear-to-b from-[#f7f7f8] via-[#e9eaec] to-[#d6d7da] px-2 shadow-[inset_0_1px_0_#fff]">
      {children}
    </div>
  )
}

function AddressToken({ children, tone = "blue" }: { children: React.ReactNode; tone?: TokenTone }) {
  const toneClass =
    tone === "green"
      ? "border-[#80a86a] bg-linear-to-b from-[#e8f7df] to-[#cdeabd] text-[#3b7a23]"
      : "border-[#66a2d1] bg-linear-to-b from-[#e8f6ff] to-[#c7eaff] text-[#1f78b6]"

  return (
    <span
      className={`inline-flex h-[24px] max-w-[180px] items-center rounded-[12px] border px-2 text-[13px] font-normal leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ${toneClass}`}
    >
      <span className="truncate">{children}</span>
      <ChevronRight className="ml-0.5 size-[12px] shrink-0 stroke-[2.2px]" />
    </span>
  )
}

function FieldRow({
  label,
  children,
  action,
}: {
  label: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex min-h-[39px] items-center border-b border-[#e1e2e4] bg-white px-3">
      <div className="w-[62px] shrink-0 text-[14px] font-normal text-[#777b80]">{label}</div>
      <div className="min-w-0 flex-1 text-[14px] font-normal text-[#1f2328]">{children}</div>
      {action ? <div className="ml-2 shrink-0">{action}</div> : null}
    </div>
  )
}

function ComposeScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <Toolbar>
        <BevelButton>取消</BevelButton>
        <div className="flex items-center gap-2">
          <BevelButton className="min-w-[35px] px-0">
            <Paperclip className="size-[16px] stroke-[2px]" />
          </BevelButton>
          <BevelButton tone="blue">
            <Send className="mr-1 size-[13px] stroke-[2.2px]" />
            发送
          </BevelButton>
        </div>
      </Toolbar>

      <FieldRow label="收件人">
        <AddressToken>班主任(e...)</AddressToken>
      </FieldRow>
      <FieldRow label="抄送/密送" action={<ChevronDown className="size-[16px] text-[#90949a]" />}>
        <span className="text-[#b4b7bb]"> </span>
      </FieldRow>
      <FieldRow label="发件人" action={<ChevronDown className="size-[16px] text-[#90949a]" />}>
        <span className="text-[#535960]">郭离杉 &lt;guolishan@smartisan.cn&gt;</span>
      </FieldRow>
      <FieldRow
        action={
          <span className="flex size-[25px] items-center justify-center rounded-full border border-[#c5c7ca] bg-linear-to-b from-[#fbfbfb] to-[#dedfe2] shadow-[inset_0_1px_0_#fff]">
            <Paperclip className="size-[14px] text-[#767a80]" />
          </span>
        }
        label="主题"
      >
        <span>Re: 小郭，帮我收一下作业</span>
      </FieldRow>

      <div className="relative min-h-0 flex-1 bg-[#fdfdfd] px-4 py-3 text-[14px] font-normal leading-[24px] text-[#333840]">
        <div className="mb-3 flex items-start">
          <span className="mt-[2px] h-[20px] w-[2px] bg-[#1d8cff]" />
          <span className="ml-[3px] text-[#1f2328]"> </span>
        </div>
        <p className="mb-4 text-[#565b61]">- 发自 Smartisan T2 -</p>

        <div className="border-l-[3px] border-[#7cb95a] pl-3 text-[#3c8c2c]">
          <p>在 2015年12月29日，下午7:06，班主任 写道：</p>
          <p className="mt-4 text-[#4a9a38]">小郭，</p>
          <p>请把大家的作业收集上来，</p>
          <p>请不要把一封一封的邮件转给我，</p>
          <p>我一个一个打开很麻烦，</p>
          <p>你收齐后整理到一封邮件里发给我。</p>
          <p className="mt-4">谢谢！</p>
        </div>
      </div>
    </div>
  )
}

function HeaderLine({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[38px] items-center border-b border-[#e3e4e6] px-3">
      <span className="w-[54px] shrink-0 text-[14px] font-normal text-[#85898f]">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function MailWatermark() {
  return (
    <div className="pointer-events-none absolute right-5 bottom-[72px] text-[#d9dcdf] opacity-55">
      <Mail className="size-[58px] stroke-[1.4px]" />
    </div>
  )
}

function BottomToolbar() {
  const actions = [
    { icon: Archive, label: "归档" },
    { icon: Reply, label: "回复" },
    { icon: ReplyAll, label: "全部" },
    { icon: Forward, label: "转发" },
    { icon: Mail, label: "移动" },
  ]

  return (
    <div className="grid h-[53px] grid-cols-5 border-t border-[#bfc0c2] bg-linear-to-b from-[#f7f7f8] via-[#e8e9eb] to-[#d2d4d8] shadow-[inset_0_1px_0_#fff]">
      {actions.map(({ icon: Icon, label }) => (
        <button
          className="flex flex-col items-center justify-center gap-0.5 border-r border-[#c6c8cb] text-[10px] font-normal text-[#595e65] last:border-r-0 active:bg-black/5"
          key={label}
          type="button"
        >
          <Icon className="size-[19px] stroke-[1.8px]" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

function ReadMailBody() {
  return (
    <div className="px-4 pt-4 text-[15px] font-normal leading-[28px] text-[#272b31]">
      <p>小郭，</p>
      <p className="mt-4">请把大家的作业收集上来，</p>
      <p>请不要把一封一封的邮件转给我，</p>
      <p>我一个一个打开很麻烦，</p>
      <p>你收齐后整理到一封邮件里发给我。</p>
      <p className="mt-4">谢谢！</p>
    </div>
  )
}

function AttachmentCard() {
  const files = [
    { name: "《新闻学》作业.doc", size: "11 KB DOC 文档" },
    { name: "《新闻学》论文.doc", size: "880 KB DOC 文档" },
  ]

  return (
    <div className="mx-3 mt-5 overflow-hidden rounded-[5px] border border-[#cfd1d4] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
      <div className="flex h-[35px] items-center justify-between border-b border-[#d7d9dc] bg-linear-to-b from-[#fbfbfb] to-[#eceef0] px-3 text-[13px] font-normal">
        <span className="text-[#747980]">共有 2 项可加载</span>
        <button className="text-[#1b80c8]" type="button">
          全部加载
        </button>
      </div>
      {files.map((file) => (
        <div className="flex h-[54px] items-center border-b border-[#ebecee] px-3 last:border-b-0" key={file.name}>
          <div className="mr-3 flex size-[32px] items-center justify-center rounded-[3px] border border-[#c3c7ce] bg-linear-to-b from-[#fbfbfb] to-[#e0e3e8] text-[#6d747e] shadow-[inset_0_1px_0_#fff]">
            <FileText className="size-[18px] stroke-[1.7px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-normal text-[#252a30]">{file.name}</div>
            <div className="mt-0.5 text-[11px] font-normal text-[#8b9096]">{file.size}</div>
          </div>
          <button className="ml-3 text-[13px] font-normal text-[#1c82ca]" type="button">
            加载
          </button>
        </div>
      ))}
    </div>
  )
}

function AttachmentFloat() {
  return (
    <div className="absolute top-[302px] left-1/2 flex h-[58px] w-[190px] -translate-x-1/2 items-center justify-center rounded-[6px] border border-black/30 bg-black/55 text-[16px] font-normal text-white shadow-[0_8px_18px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
      已选择 3 个附件
    </div>
  )
}

function ReadScreen({ variant }: { variant: "normal" | "attachment" }) {
  const isAttachment = variant === "attachment"

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-white">
      <Toolbar>
        <BevelButton>
          <ChevronLeft className="mr-0.5 size-[15px] stroke-[2.4px]" />
          返回
        </BevelButton>
        <div className="flex items-center gap-2">
          <BevelButton className="min-w-[35px] px-0">
            <CalendarDays className="size-[16px] stroke-[1.9px]" />
          </BevelButton>
          <BevelButton className="min-w-[35px] px-0" tone="red">
            <Trash2 className="size-[16px] stroke-[1.9px]" />
          </BevelButton>
        </div>
      </Toolbar>

      <div className="border-b border-[#d9dbde] bg-white shadow-[0_1px_0_rgba(255,255,255,0.8)]">
        <HeaderLine label="发件人">
          <AddressToken>班主任</AddressToken>
        </HeaderLine>
        <HeaderLine label="收件人">
          <AddressToken>郭离杉</AddressToken>
        </HeaderLine>
        <div className="relative px-3 py-3">
          <h3 className="pr-9 text-[18px] font-normal leading-[24px] text-[#20242a]">
            {isAttachment ? "陈书军《新闻学》作业和论文" : "小郭，帮我收一下作业"}
          </h3>
          <p className="mt-1 text-[12px] font-normal text-[#8a8f96]">
            {isAttachment ? "2015年12月30日周三，上午9:14" : "2015年12月29日周二，下午7:06"}
          </p>
          <Flag className="absolute top-4 right-3 size-[20px] fill-[#d4d7da] stroke-[#b2b6bb] stroke-[1.5px]" />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#fdfdfd]">
        {isAttachment ? (
          <>
            <div className="px-4 pt-4 text-[15px] font-normal leading-[28px] text-[#272b31]">
              <p>请查收。</p>
            </div>
            <AttachmentCard />
            <AttachmentFloat />
          </>
        ) : (
          <ReadMailBody />
        )}
        <MailWatermark />
      </div>

      <BottomToolbar />
    </div>
  )
}

function ViewSwitcher({ value, onChange }: { value: MailView; onChange: (value: MailView) => void }) {
  const items: { value: MailView; label: string }[] = [
    { value: "compose", label: "写邮件" },
    { value: "read", label: "阅读邮件" },
    { value: "attachment", label: "附件邮件" },
  ]

  return (
    <div className="mt-4 flex rounded-[5px] border border-[#c5c7cb] bg-[#eceef1] p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
      {items.map((item) => (
        <button
          className={`h-[30px] min-w-[74px] rounded-[4px] px-3 text-[13px] font-normal transition-colors ${
            value === item.value
              ? "bg-linear-to-b from-[#ffffff] to-[#d8dadf] text-[#262a30] shadow-[inset_0_1px_0_#fff,0_1px_2px_rgba(0,0,0,0.16)]"
              : "text-[#626870] hover:text-[#2d333a]"
          }`}
          key={item.value}
          onClick={() => onChange(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default function SmartisanMail() {
  const [view, setView] = useState<MailView>("read")

  return (
    <div className="flex w-full flex-col items-center px-2 py-4">
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-[7px] border border-[#b9bcc1] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="flex h-[640px] flex-col bg-white">
          <StatusBar />
          {view === "compose" ? <ComposeScreen /> : null}
          {view === "read" ? <ReadScreen variant="normal" /> : null}
          {view === "attachment" ? <ReadScreen variant="attachment" /> : null}
        </div>
      </div>
      <ViewSwitcher onChange={setView} value={view} />
    </div>
  )
}
