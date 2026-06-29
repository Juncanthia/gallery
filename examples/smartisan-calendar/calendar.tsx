import type { ReactNode } from "react"
import {
  Battery,
  ChevronLeft,
  ChevronRight,
  CloudFog,
  Gift,
  Mail,
  MessageCircle,
  Settings,
  UserRound,
  Wifi,
} from "lucide-react"

const days = [
  ["30", "1", "2", "3", "4", "5", "6"],
  ["7", "8", "9", "10", "11", "12", "13"],
  ["14", "15", "16", "17", "18", "19", "20"],
  ["21", "22", "23", "24", "25", "26", "27"],
  ["28", "29", "30", "31", "1", "2", "3"],
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

function BevelButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={`flex h-[42px] min-w-[58px] items-center justify-center rounded-[5px] border border-[#cfd2d6] bg-linear-to-b from-[#ffffff] via-[#f3f4f5] to-[#e1e3e6] px-2 text-[15px] font-normal text-[#89909a] shadow-[inset_0_1px_0_#fff,0_1px_1px_rgba(0,0,0,0.1)] active:translate-y-px ${className}`}
      type="button"
    >
      {children}
    </button>
  )
}

function Header() {
  return (
    <div className="flex h-[70px] items-center border-b border-[#d2d5d9] bg-linear-to-b from-[#fbfbfc] via-[#f2f3f5] to-[#e6e8eb] px-2 shadow-[inset_0_1px_0_#fff]">
      <div className="z-10 w-[72px]">
        <BevelButton className="min-w-[58px]">
          <Settings className="size-[24px] fill-[#8f949b] stroke-[#8f949b]" />
        </BevelButton>
      </div>
      <div className="flex flex-1 items-center justify-center gap-8">
        <ChevronLeft className="size-[28px] text-[#d2d5d9]" />
        <div className="text-[28px] font-normal leading-none tracking-[-0.04em] text-[#69707a] [text-shadow:0_1px_0_#fff]">
          2015年12月
        </div>
        <ChevronRight className="size-[28px] text-[#d2d5d9]" />
      </div>
      <div className="w-[72px]" />
    </div>
  )
}

function WeekHeader() {
  return (
    <div className="grid h-[34px] grid-cols-7 border-b border-[#d8dce0] bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(245,247,249,0.86)),repeating-linear-gradient(90deg,rgba(0,0,0,0.025)_0,rgba(0,0,0,0.025)_1px,transparent_1px,transparent_4px)] text-center text-[13px] font-normal leading-[34px] text-[#737b86]">
      {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((week) => (
        <div className="border-r border-[#e1e4e8] last:border-r-0" key={week}>{week}</div>
      ))}
    </div>
  )
}

function MonthGrid() {
  return (
    <div className="grid grid-rows-5 border-b border-[#d8dce0] bg-white">
      {days.map((row, rowIndex) => (
        <div className="grid h-[70px] grid-cols-7" key={row.join("-")}> 
          {row.map((day, columnIndex) => {
            const selected = day === "29" && rowIndex === 4
            const muted = (rowIndex === 0 && columnIndex === 0) || (rowIndex === 4 && columnIndex >= 4)
            return (
              <div
                className={`relative flex flex-col items-center justify-center border-r border-b border-[#e0e3e7] text-[27px] font-normal last:border-r-0 ${
                  selected
                    ? "bg-linear-to-b from-[#86a9ef] to-[#4f78d6] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_0_0_1px_rgba(44,80,160,0.18)]"
                    : muted
                      ? "bg-linear-to-b from-[#f1f2f3] to-[#dedfe1] text-[#babfc5]"
                      : "bg-white text-[#626a75]"
                }`}
                key={`${rowIndex}-${columnIndex}-${day}`}
              >
                <span>{day}</span>
                {rowIndex === 4 ? (
                  <span className={`mt-1 size-[4px] rounded-full ${selected ? "bg-white" : "bg-[#c3c8ce]"}`} />
                ) : null}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Agenda() {
  return (
    <div className="mx-4 mt-4 overflow-hidden border border-[#d6d9de] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="grid h-[56px] grid-cols-[70px_1fr] border-b border-[#dfe2e6] bg-white">
        <div className="flex items-center justify-center border-r border-[#dfe2e6]">
          <CloudFog className="size-[24px] text-[#bdc2c8]" />
        </div>
        <div className="flex items-center px-6 text-[24px] font-normal text-[#aab0b8]">霾 1 至 3°C</div>
      </div>
      <div className="grid h-[58px] grid-cols-[70px_1fr] border-b border-[#dfe2e6] bg-white">
        <div className="flex items-center justify-center border-r border-[#dfe2e6]">
          <span className="size-[13px] rounded-full bg-linear-to-b from-[#9dbbff] to-[#4f7fec] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
        </div>
        <div className="flex items-center px-6 text-[22px] font-normal text-[#68717d]">前往国家会议中心</div>
      </div>
      <div className="grid h-[58px] grid-cols-[70px_1fr] bg-white">
        <div className="flex items-center justify-center border-r border-[#dfe2e6]">
          <span className="size-[13px] rounded-full bg-linear-to-b from-[#9dbbff] to-[#4f7fec] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]" />
        </div>
        <div className="flex items-center gap-3 px-6 text-[22px] font-normal text-[#68717d]">
          <span className="flex size-[27px] items-center justify-center rounded-full bg-[#fa7264] text-white">
            <Gift className="size-[16px]" />
          </span>
          锤子科技产品发布会
        </div>
      </div>
    </div>
  )
}

function BottomBar() {
  return (
    <div className="mt-auto flex h-[50px] border-t border-[#c8cbd0] bg-linear-to-b from-[#f3f4f5] to-[#d9dce0] px-2 py-1 shadow-[inset_0_1px_0_#fff]">
      <BevelButton className="min-w-[74px]">新建</BevelButton>
      <div className="ml-8 grid flex-1 grid-cols-3 overflow-hidden rounded-[5px] border border-[#c8cbd0] bg-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]">
        {[
          ["日", false],
          ["周", false],
          ["月", true],
        ].map(([label, active]) => (
          <button
            className={`border-r border-[#d3d6db] text-[18px] font-normal last:border-r-0 ${
              active
                ? "bg-linear-to-b from-[#c2c4ca] to-[#aeb1b8] text-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.18)]"
                : "bg-linear-to-b from-[#fff] to-[#eceef1] text-[#7f8790]"
            }`}
            key={label as string}
            type="button"
          >
            {label as string}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SmartisanCalendar() {
  return (
    <div className="flex w-full flex-col items-center px-2 py-4">
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-[7px] border border-[#b9bcc1] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="flex h-[640px] flex-col bg-[linear-gradient(90deg,rgba(255,255,255,0.92),rgba(245,247,249,0.86)),repeating-linear-gradient(90deg,rgba(0,0,0,0.026)_0,rgba(0,0,0,0.026)_1px,transparent_1px,transparent_4px)]">
          <StatusBar />
          <Header />
          <WeekHeader />
          <MonthGrid />
          <Agenda />
          <BottomBar />
        </div>
      </div>
    </div>
  )
}
