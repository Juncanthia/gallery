import {
  Battery,
  Bluetooth,
  Cloud,
  GalleryHorizontalEnd,
  Image,
  Keyboard,
  MessageCircle,
  Navigation,
  Plane,
  RadioTower,
  Search,
  Settings,
  Signal,
  Smartphone,
  Sparkles,
  ToggleLeft,
  UserRound,
  Wifi,
} from "lucide-react"
import type { ComponentType } from "react"

type SettingRow = {
  title: string
  value?: string
  icon: ComponentType<{ className?: string }>
  control?: "switch"
  info?: boolean
}

const groups: SettingRow[][] = [
  [
    { title: "飞行模式", icon: Plane, control: "switch", info: true },
    { title: "无线网络", value: "NETGEAR86", icon: Wifi },
    { title: "蜂窝移动数据", value: "北京", icon: RadioTower },
    { title: "GPS 定位服务", icon: Navigation, control: "switch" },
    { title: "蓝牙", value: "已开启", icon: Bluetooth },
    { title: "双卡设置", icon: Smartphone },
    { title: "更多无线和网络设置", icon: Signal },
  ],
  [
    { title: "大爆炸", icon: Sparkles },
    { title: "一步", icon: GalleryHorizontalEnd },
    { title: "闪念胶囊", icon: ToggleLeft },
  ],
  [
    { title: "主题、壁纸、图标", icon: Image },
    { title: "桌面设置项", icon: Smartphone },
    { title: "屏幕和字体", icon: Settings },
    { title: "语言和键盘", icon: Keyboard },
  ],
  [
    { title: "欢喜云服务", icon: Cloud },
  ],
]

function StatusBar() {
  return (
    <div className="flex h-[35px] items-center justify-between border-b border-[#e2e4e6] bg-[#fbfbfb] px-3 text-[#4f5358]">
      <div className="flex w-[86px] items-center gap-1.5">
        <UserRound className="size-[15px] fill-[#55585c] stroke-[#55585c]" />
        <MessageCircle className="size-[18px] fill-[#55585c] stroke-[#55585c]" />
        <span className="relative h-[15px] w-[20px] border-2 border-[#55585c]">
          <span className="absolute top-[1px] left-[3px] h-[10px] w-[11px] rotate-45 border-r-2 border-b-2 border-[#55585c]" />
        </span>
      </div>
      <div className="text-[17px] font-medium leading-none tracking-[-0.02em] text-[#4b4f54]">7:30PM</div>
      <div className="flex w-[86px] items-center justify-end gap-1.5">
        <Wifi className="size-[20px] text-[#4aa1ff]" />
        <Signal className="size-[21px] fill-[#62a5f4] stroke-[#62a5f4]" />
        <Battery className="size-[25px] fill-[#a6d546] stroke-[#6e8f22]" />
      </div>
    </div>
  )
}

function TitleBar() {
  return (
    <div className="relative flex h-[72px] items-center justify-center border-b border-[#e0e1e3] bg-linear-to-b from-[#ffffff] via-[#fbfbfb] to-[#f0f1f2] shadow-[inset_0_1px_0_#fff]">
      <h2 className="text-[31px] font-normal tracking-[-0.06em] text-[#686c72] [text-shadow:0_1px_0_#fff]">
        设置
      </h2>
      <Search className="absolute right-5 size-[33px] text-[#8b8e92] stroke-[2.7px]" />
    </div>
  )
}

function SettingIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="flex h-full w-[60px] shrink-0 items-center justify-center border-r border-[#e8eaec] bg-[#fbfbfb]">
      <Icon className="size-[27px] text-[#c9cbcf] stroke-[2.5px]" />
    </div>
  )
}

function InfoBadge() {
  return (
    <span className="ml-3 inline-flex size-[24px] items-center justify-center rounded-full border border-[#d9dadd] bg-white text-[19px] italic leading-none text-[#c3c6ca] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
      i
    </span>
  )
}

function SmartisanSwitch() {
  return (
    <span className="relative ml-4 inline-flex h-[38px] w-[78px] items-center rounded-full border border-[#e2e3e5] bg-linear-to-b from-[#ffffff] to-[#f4f5f6] shadow-[inset_0_2px_5px_rgba(0,0,0,0.06)]">
      <span className="ml-[3px] size-[35px] rounded-full border border-[#d8dadd] bg-linear-to-b from-[#ffffff] to-[#f3f4f5] shadow-[0_9px_14px_rgba(0,0,0,0.16),inset_0_1px_0_#fff]" />
      <span className="absolute right-[11px] size-[16px] rounded-full border border-[#edf0f2] bg-[#fafafa]" />
    </span>
  )
}

function SettingGroup({ rows }: { rows: SettingRow[] }) {
  return (
    <div className="mb-[14px] overflow-hidden rounded-[7px] border border-[#dfe1e4] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      {rows.map((row, index) => (
        <SettingItem first={index === 0} key={row.title} last={index === rows.length - 1} row={row} />
      ))}
    </div>
  )
}

function SettingItem({ row, first, last }: { row: SettingRow; first: boolean; last: boolean }) {
  return (
    <button
      className={`flex h-[72px] w-full items-center bg-white text-left ${first ? "rounded-t-[7px]" : ""} ${last ? "rounded-b-[7px]" : "border-b border-[#e8e9eb]"}`}
      type="button"
    >
      <SettingIcon icon={row.icon} />
      <div className="flex min-w-0 flex-1 items-center justify-between px-4">
        <div className="flex min-w-0 items-center">
          <span className="truncate text-[26px] font-normal tracking-[-0.08em] text-[#373b40]">
            {row.title}
          </span>
          {row.info ? <InfoBadge /> : null}
        </div>
        <div className="ml-4 flex shrink-0 items-center">
          {row.control === "switch" ? <SmartisanSwitch /> : null}
          {row.value ? <span className="text-[22px] font-normal tracking-[-0.05em] text-[#8a8d92]">{row.value}</span> : null}
          {row.control !== "switch" ? <span className="ml-3 text-[40px] font-normal leading-none text-[#b8babd]">›</span> : null}
        </div>
      </div>
    </button>
  )
}

export default function SmartisanSettingsExample() {
  return (
    <div className="flex w-full flex-col items-center px-2 py-4">
      <div
        className="w-full max-w-[430px] overflow-hidden rounded-[7px] border border-[#d2d5d9] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="flex h-[760px] flex-col bg-[linear-gradient(90deg,rgba(255,255,255,0.9),rgba(244,246,248,0.84)),repeating-linear-gradient(90deg,rgba(0,0,0,0.025)_0,rgba(0,0,0,0.025)_1px,transparent_1px,transparent_4px)]">
          <StatusBar />
          <TitleBar />
          <div className="min-h-0 flex-1 overflow-hidden px-3 pt-[15px]">
            {groups.map((rows, index) => (
              <SettingGroup key={index} rows={rows} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
