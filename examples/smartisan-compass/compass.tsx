import { Battery, Info, Mail, MessageCircle, UserRound, Wifi } from "lucide-react"
import type { CSSProperties } from "react"

const DEGREE_LABELS = [30, 60, 120, 150, 210, 240, 300, 330]
const CARDINAL_LABELS = [
  { label: "N", angle: 0, color: "#c94338" },
  { label: "E", angle: 90, color: "#4d4d4d" },
  { label: "S", angle: 180, color: "#4d4d4d" },
  { label: "W", angle: 270, color: "#4d4d4d" },
]

function polarStyle(angle: number, radius: number): CSSProperties {
  const radian = ((angle - 90) * Math.PI) / 180

  return {
    left: `calc(50% + ${Math.cos(radian) * radius}px)`,
    top: `calc(50% + ${Math.sin(radian) * radius}px)`,
    transform: "translate(-50%, -50%)",
  }
}

function StatusBar() {
  return (
    <div className="flex h-[30px] items-center justify-between px-2.5 text-[#5d6266]">
      <div className="flex items-center gap-1.5 opacity-90">
        <UserRound className="size-[13px] fill-current stroke-current" />
        <MessageCircle className="size-[15px] fill-current stroke-current" />
        <Mail className="size-[15px] stroke-[2.4px]" />
      </div>
      <div className="text-[14px] font-normal leading-none tracking-normal text-[#4f5458]">7:30PM</div>
      <div className="flex items-center gap-1.5 opacity-90">
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

function InfoButton() {
  return (
    <button
      aria-label="应用信息"
      className="absolute right-[18px] top-[48px] flex size-[34px] items-center justify-center rounded-full border border-[#cacaca] bg-linear-to-b from-[#ffffff] via-[#f7f7f7] to-[#dedede] text-[#8d9296] shadow-[0_2px_4px_rgba(0,0,0,0.18),inset_0_1px_0_#fff,inset_0_-1px_2px_rgba(0,0,0,0.08)]"
      type="button"
    >
      <Info className="size-[18px] stroke-[2.6px]" />
    </button>
  )
}

function Pointer() {
  return (
    <div className="absolute left-1/2 top-[92px] z-20 -translate-x-1/2">
      <div className="h-0 w-0 border-x-[15px] border-b-[24px] border-x-transparent border-b-[#c74236] drop-shadow-[0_2px_1px_rgba(0,0,0,0.15)]" />
      <div className="absolute left-1/2 top-[5px] h-0 w-0 -translate-x-1/2 border-x-[8px] border-b-[14px] border-x-transparent border-b-[#e6776e] opacity-70" />
    </div>
  )
}

function TickMarks() {
  return (
    <>
      {Array.from({ length: 120 }, (_, index) => {
        const angle = index * 3
        const isMajor = angle % 30 === 0
        const isMedium = angle % 15 === 0
        const width = isMajor ? 2 : 1
        const height = isMajor ? 16 : isMedium ? 11 : 7

        return (
          <span
            className="absolute rounded-full"
            key={angle}
            style={{
              background: isMajor ? "#383838" : isMedium ? "#747474" : "#a5a5a5",
              height,
              left: "50%",
              marginLeft: -width / 2,
              opacity: isMajor ? 0.9 : 0.72,
              top: 17,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "50% 133px",
              width,
            }}
          />
        )
      })}
    </>
  )
}

function DegreeLabels() {
  return (
    <>
      {DEGREE_LABELS.map((degree) => (
        <span
          className="absolute text-[11px] font-normal leading-none text-[#686868]"
          key={degree}
          style={polarStyle(degree, 104)}
        >
          {degree}
        </span>
      ))}
    </>
  )
}

function CardinalLabels() {
  return (
    <>
      {CARDINAL_LABELS.map((item) => (
        <span
          className="absolute text-[26px] font-normal leading-none tracking-[-0.08em]"
          key={item.label}
          style={{ ...polarStyle(item.angle, 78), color: item.color }}
        >
          {item.label}
        </span>
      ))}
      <span className="absolute left-1/2 top-[28px] h-0 w-0 -translate-x-1/2 border-x-[7px] border-b-[12px] border-x-transparent border-b-[#d14b40]" />
    </>
  )
}

function CenterCross() {
  return (
    <div className="absolute left-1/2 top-1/2 size-[32px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#dadada] bg-[#f9f9f9] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
      <span className="absolute left-1/2 top-[6px] h-[20px] w-px -translate-x-1/2 bg-[#9d9d9d]" />
      <span className="absolute left-[6px] top-1/2 h-px w-[20px] -translate-y-1/2 bg-[#9d9d9d]" />
      <span className="absolute left-1/2 top-1/2 size-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#777]" />
    </div>
  )
}

function CompassDial() {
  return (
    <div className="relative mx-auto mt-[116px] size-[306px] rounded-full bg-[radial-gradient(circle_at_50%_48%,#ffffff_0,#f7f7f5_54%,#e4e3df_68%,#c8c8c5_78%,#f6f6f4_100%)] p-[17px] shadow-[0_14px_26px_rgba(0,0,0,0.22),0_2px_4px_rgba(0,0,0,0.22),inset_0_2px_4px_rgba(255,255,255,0.92),inset_0_-5px_9px_rgba(0,0,0,0.16)]">
      <div className="absolute inset-[4px] rounded-full border border-[rgba(255,255,255,0.82)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]" />
      <div className="relative size-full rounded-full border border-[#bebeba] bg-[radial-gradient(circle_at_50%_45%,#ffffff_0,#ffffff_43%,#f4f3ef_67%,#ecebe6_100%)] shadow-[inset_0_2px_5px_rgba(0,0,0,0.08),inset_0_-2px_4px_rgba(255,255,255,0.7)]">
        <div className="absolute inset-[7px] rounded-full border border-[#e9e8e4]" />
        <div className="absolute inset-[21px] rounded-full border border-[#efefeb]" />
        <TickMarks />
        <DegreeLabels />
        <CardinalLabels />
        <CenterCross />
      </div>
    </div>
  )
}

function CompassReadout() {
  return (
    <div className="mt-[56px] text-center text-[#53575a]">
      <div className="text-[38px] font-normal leading-none tracking-[-0.08em] text-[#3f4346]">北 0°</div>
      <div className="mt-5 text-[13px] font-normal leading-none text-[#74797d]">
        成都市成华区 | 30°40&apos;12&quot; N | 104°5&apos;38&quot; E
      </div>
    </div>
  )
}

export default function SmartisanCompass() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <div
        className="mx-auto flex min-w-[390px] justify-center"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="relative h-[690px] w-[380px] overflow-hidden rounded-[3px] border border-[#c9c9c4] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(238,238,232,0.82)),radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.98),rgba(229,228,220,0.7)_58%,rgba(214,213,204,0.82)),repeating-linear-gradient(90deg,rgba(90,82,65,0.026)_0,rgba(90,82,65,0.026)_1px,transparent_1px,transparent_5px)] shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
          <StatusBar />
          <InfoButton />
          <Pointer />
          <CompassDial />
          <CompassReadout />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.8),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.25),transparent_18%,transparent_82%,rgba(0,0,0,0.05))]" />
        </div>
      </div>
    </div>
  )
}
