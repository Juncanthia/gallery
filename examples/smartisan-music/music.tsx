import { useState } from "react"
import type { ComponentType, ReactNode } from "react"
import {
  Battery,
  ChevronLeft,
  Disc3,
  ListMusic,
  Music2,
  Pencil,
  Search,
  Shuffle,
  Star,
  Trash2,
  UserRound,
  Volume2,
  Wifi,
} from "lucide-react"

type MusicView = "search" | "songs" | "album"

type Song = {
  title: string
  artist: string
  rating: number
  duration?: string
  muted?: boolean
}

const searchSections = [
  {
    title: "歌曲 (2)",
    rows: [
      { title: "白银饭店", subtitle: "张玮玮" },
      { title: "米店", subtitle: "张玮玮" },
    ],
  },
  {
    title: "艺术家 (1)",
    rows: [{ title: "万能青年旅店", subtitle: "" }],
  },
  {
    title: "专辑 (2)",
    rows: [
      { title: "白银饭店", subtitle: "张玮玮" },
      { title: "万能青年旅店 同名专辑", subtitle: "万能青年旅店" },
    ],
  },
]

const ratedSongs: Song[] = [
  { title: "白银饭店", artist: "张玮玮", rating: 5 },
  { title: "沪沽湖情歌", artist: "左小祖咒", rating: 5 },
  { title: "米店", artist: "张玮玮", rating: 5 },
  { title: "杀死那个石家庄人", artist: "万能青年旅店", rating: 5, muted: true },
  { title: "香格里拉", artist: "左小祖咒", rating: 4 },
  { title: "十万嬉皮", artist: "万能青年旅店", rating: 3 },
]

const albumTracks: Song[] = [
  { title: "雾都孤儿", artist: "", rating: 0, duration: "5:26" },
  { title: "白银饭店", artist: "", rating: 0 },
  { title: "秀水街", artist: "", rating: 0, duration: "3:57" },
  { title: "庙会", artist: "", rating: 0, duration: "2:50" },
  { title: "水手", artist: "", rating: 0, duration: "4:46" },
  { title: "两个兄弟", artist: "", rating: 0, duration: "4:02" },
]

function StatusBar() {
  return (
    <div className="flex h-[30px] items-center justify-between bg-[#060606] px-2.5 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.12)]">
      <div className="flex items-center gap-1.5 opacity-95">
        <UserRound className="size-[14px] fill-white stroke-white" />
        <span className="h-[15px] w-[18px] rounded-full bg-white" />
        <span className="relative h-[12px] w-[16px] border border-white bg-white">
          <span className="absolute top-[1px] left-[2px] h-[8px] w-[10px] rotate-45 border-r border-b border-black/45" />
        </span>
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
      className={`flex h-[35px] min-w-[52px] items-center justify-center rounded-[4px] border border-[#cfd1d5] bg-linear-to-b from-[#ffffff] via-[#f4f5f6] to-[#e4e6e9] px-2 text-[15px] font-normal text-[#8b9097] shadow-[inset_0_1px_0_#fff,0_1px_1px_rgba(0,0,0,0.08)] active:translate-y-px ${className}`}
      type="button"
    >
      {children}
    </button>
  )
}

function RecordButton() {
  return (
    <button
      className="relative flex size-[40px] items-center justify-center rounded-[5px] border border-[#d1d3d6] bg-linear-to-b from-[#fdfdfd] to-[#e6e8eb] shadow-[inset_0_1px_0_#fff,0_1px_1px_rgba(0,0,0,0.1)]"
      type="button"
    >
      <span className="relative size-[30px] rounded-full bg-radial from-[#cb3739] from-[0_16%] via-[#33383e] via-[17%_42%] to-[#080808] shadow-[inset_0_2px_5px_rgba(255,255,255,0.25),inset_0_-4px_8px_rgba(0,0,0,0.55),0_1px_2px_rgba(0,0,0,0.25)]">
        <span className="absolute top-[11px] left-[11px] size-[8px] rounded-full bg-[#2b3037] shadow-[inset_0_1px_2px_rgba(0,0,0,0.75)]" />
        <span className="absolute top-[8px] left-[13px] size-[4px] rounded-full bg-[#e04b4d]" />
      </span>
    </button>
  )
}

function Header({ title, left }: { title: string; left?: ReactNode }) {
  return (
    <div className="flex h-[70px] items-center border-b border-[#d2d4d7] bg-linear-to-b from-[#fafafa] via-[#f2f3f4] to-[#e5e7e9] px-2 shadow-[inset_0_1px_0_#fff]">
      <div className="z-10 w-[78px]">{left}</div>
      <div className="flex-1 text-center text-[25px] font-normal leading-none tracking-[-0.03em] text-[#777b81] [text-shadow:0_1px_0_#fff]">
        {title}
      </div>
      <div className="z-10 flex w-[78px] justify-end">
        <RecordButton />
      </div>
    </div>
  )
}

function HighlightRed({ text }: { text: string }) {
  const index = text.indexOf("店")
  if (index < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <span className="text-[#e13636]">店</span>
      {text.slice(index + 1)}
    </>
  )
}

function SearchScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <Header title="搜索" />
      <div className="flex h-[60px] items-center gap-2 border-b border-[#d7d9dc] bg-linear-to-b from-[#f9f9fa] to-[#eceef0] px-2">
        <div className="flex h-[36px] min-w-0 flex-1 items-center rounded-[18px] border border-[#d5d7db] bg-white px-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
          <Search className="mr-2 size-[20px] text-[#c2c6cb]" />
          <span className="flex-1 text-[15px] font-medium text-[#50555c]">店</span>
          <span className="flex size-[22px] items-center justify-center rounded-full bg-[#c7cbd0] text-[17px] leading-none text-white">×</span>
        </div>
        <BevelButton>取消</BevelButton>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        {searchSections.map((section) => (
          <div key={section.title}>
            <div className="flex h-[36px] items-center border-y border-[#d5d6d8] bg-[#e3e3e4] px-4 text-[18px] font-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              {section.title}
            </div>
            {section.rows.map((row) => (
              <div className="flex h-[84px] flex-col justify-center border-b border-[#ebedef] px-4" key={`${section.title}-${row.title}`}>
                <div className="text-[21px] font-normal leading-[25px] text-[#2e3339]">
                  <HighlightRed text={row.title} />
                </div>
                {row.subtitle ? (
                  <div className="mt-1 text-[16px] font-normal leading-none text-[#a5a9ae]">
                    <HighlightRed text={row.subtitle} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SortTabs() {
  const items = ["歌曲名", "评分", "播放次数", "添加时间"]
  return (
    <div className="flex h-[58px] items-center gap-2 border-b border-[#d7d9dc] bg-linear-to-b from-[#f9fafa] to-[#eff0f2] px-2">
      <BevelButton className="min-w-[48px]">
        <Shuffle className="size-[18px] text-[#969ba2]" />
      </BevelButton>
      <div className="grid h-[40px] flex-1 grid-cols-4 overflow-hidden rounded-[4px] border border-[#d4d6da] bg-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]">
        {items.map((item) => (
          <button
            className={`border-r border-[#d8dade] text-[16px] font-normal last:border-r-0 ${
              item === "评分"
                ? "bg-linear-to-b from-[#d0d1d4] to-[#b9bbbf] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.16)]"
                : "bg-linear-to-b from-[#fff] to-[#f4f5f6] text-[#848991]"
            }`}
            key={item}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function RatingStars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-[1px]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          className={`size-[16px] stroke-[1.3px] ${index < count ? "fill-[#ffd85b] stroke-[#f2b526]" : "fill-[#e8eaed] stroke-[#d8dade]"}`}
          key={index}
        />
      ))}
    </div>
  )
}

function SectionBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[36px] items-center border-y border-[#d5d6d8] bg-[#e3e3e4] px-4 text-[18px] font-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
      {children}
    </div>
  )
}

function SongRow({ song }: { song: Song }) {
  return (
    <div className="flex h-[84px] items-center border-b border-[#ebedef] px-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center text-[20px] font-normal leading-[24px] text-[#2e3339]">
          <span className="truncate">{song.title}</span>
          {song.muted ? <Volume2 className="ml-2 size-[17px] fill-[#b8bdc3] stroke-[#b8bdc3]" /> : null}
        </div>
        <div className="mt-1 truncate text-[16px] font-normal leading-none text-[#a5a9ae]">{song.artist}</div>
      </div>
      <RatingStars count={song.rating} />
    </div>
  )
}

function FloatingKnob() {
  return (
    <div className="absolute right-[68px] bottom-[48px] flex size-[74px] items-center justify-center rounded-full border border-[#4a4d50] bg-linear-to-b from-[#74777a] via-[#53565a] to-[#383a3d] shadow-[inset_0_2px_2px_rgba(255,255,255,0.18),inset_0_-4px_6px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.38)]">
      <div className="flex items-center gap-[5px]">
        {[18, 26, 31, 26, 18].map((height, index) => (
          <span className="w-[4px] rounded-[2px] bg-[#9da0a3] shadow-[0_1px_0_rgba(0,0,0,0.45)]" key={index} style={{ height }} />
        ))}
      </div>
    </div>
  )
}

function SongsScreen() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-white">
      <Header left={<BevelButton>编辑</BevelButton>} title="歌曲" />
      <SortTabs />
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        <SectionBar>5 星评分</SectionBar>
        {ratedSongs.slice(0, 4).map((song) => (
          <SongRow key={song.title} song={song} />
        ))}
        <SectionBar>4 星评分</SectionBar>
        <SongRow song={ratedSongs[4]} />
        <SectionBar>3 星评分</SectionBar>
        <SongRow song={ratedSongs[5]} />
      </div>
      <FloatingKnob />
    </div>
  )
}

function AlbumCover() {
  return (
    <div className="h-[118px] w-[118px] overflow-hidden border border-[#d2d2d2] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.16)]">
      <div className="h-[72px] bg-black px-4 py-2 text-[18px] leading-[24px] tracking-[0.2em] text-white [writing-mode:vertical-rl]">
        白银饭店
      </div>
      <div className="relative h-[46px] bg-[#f8f8f8] px-2 pt-1 text-[4px] leading-[5px] text-[#303030]">
        <p>张玮玮，白银饭店。低声唱出的城市、旧街、风和夜晚。</p>
        <p>像一张放在抽屉里的纸片，边缘略微发黄。</p>
        <div className="absolute right-2 bottom-1 size-[18px] rounded-full border border-[#111] bg-white">
          <div className="absolute top-[4px] left-[6px] h-[10px] w-[6px] rounded-full border border-[#111]" />
        </div>
      </div>
    </div>
  )
}

function AlbumHeader() {
  return (
    <div className="flex h-[174px] border-b border-[#d9dbde] bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_0%,rgba(242,244,246,0.82)_100%),repeating-linear-gradient(90deg,rgba(0,0,0,0.025)_0,rgba(0,0,0,0.025)_1px,transparent_1px,transparent_4px)] px-4 py-5">
      <AlbumCover />
      <div className="ml-5 min-w-0 flex-1 pt-4">
        <div className="text-[22px] font-normal leading-[26px] text-[#565b62]">白银饭店</div>
        <div className="mt-1 text-[17px] font-normal text-[#565b62]">张玮玮</div>
        <div className="mt-8 text-[17px] font-normal text-[#b1b5ba]">年份：2012</div>
      </div>
      <div className="flex items-end pb-1">
        <BevelButton className="min-w-[48px]">
          <Shuffle className="size-[18px] text-[#8e939a]" />
        </BevelButton>
      </div>
    </div>
  )
}

function TrackRow({ song, index }: { song: Song; index: number }) {
  if (index === 1) {
    return (
      <div className="flex h-[66px] border-b border-[#eceef0] bg-white">
        <div className="grid w-[130px] grid-cols-2 border-r border-[#d5d7db] bg-linear-to-b from-[#f0f1f2] to-[#e1e3e5]">
          <button className="flex items-center justify-center border-r border-[#d0d2d5]" type="button">
            <Pencil className="size-[24px] text-[#a8adb3]" />
          </button>
          <button className="flex items-center justify-center" type="button">
            <Trash2 className="size-[24px] text-[#a8adb3]" />
          </button>
        </div>
        <div className="flex flex-1 items-center px-5">
          <span className="w-[34px] text-[22px] font-normal text-[#a7abb1]">2</span>
          <span className="text-[20px] font-normal text-[#2f343a]">{song.title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[66px] items-center border-b border-[#eceef0] px-5">
      <span className="w-[34px] text-[22px] font-normal text-[#a7abb1]">{index + 1}</span>
      <span className="min-w-0 flex-1 truncate text-[20px] font-normal text-[#2f343a]">{song.title}</span>
      {song.duration ? <span className="text-[16px] font-normal text-[#a5aab0]">{song.duration}</span> : null}
    </div>
  )
}

function AlbumScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <Header
        left={
          <BevelButton>
            <ChevronLeft className="mr-0.5 size-[17px] stroke-[2.4px]" />
            专辑
          </BevelButton>
        }
        title="白银饭店"
      />
      <AlbumHeader />
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        {albumTracks.map((song, index) => (
          <TrackRow index={index} key={song.title} song={song} />
        ))}
      </div>
    </div>
  )
}

function BottomTab({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`relative flex h-[66px] flex-1 flex-col items-center justify-center gap-1 border-r border-black/35 text-[12px] font-normal last:border-r-0 ${
        active
          ? "bg-linear-to-b from-[#303030] via-[#151515] to-[#090909] text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]"
          : "bg-linear-to-b from-[#3d3d3d] via-[#2a2a2a] to-[#1d1d1d] text-[#8b8e92]"
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon className={`size-[29px] ${active ? "text-white" : "text-[#8b8e92]"}`} />
      <span>{label}</span>
      {label === "搜索" ? <span className="absolute right-[5px] top-[28px] text-[10px] text-[#8b8e92]">◆</span> : null}
    </button>
  )
}

function BottomTabs({ value, onChange }: { value: MusicView; onChange: (value: MusicView) => void }) {
  return (
    <div className="flex h-[66px] border-t border-black/60 bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
      <BottomTab active={false} icon={ListMusic} label="播放列表" onClick={() => onChange("songs")} />
      <BottomTab active={false} icon={UserRound} label="艺术家" onClick={() => onChange("search")} />
      <BottomTab active={value === "album"} icon={Disc3} label="专辑" onClick={() => onChange("album")} />
      <BottomTab active={value === "songs"} icon={Music2} label="歌曲" onClick={() => onChange("songs")} />
      <BottomTab active={value === "search"} icon={Search} label="搜索" onClick={() => onChange("search")} />
    </div>
  )
}

function ViewSwitcher({ value, onChange }: { value: MusicView; onChange: (value: MusicView) => void }) {
  const items: { value: MusicView; label: string }[] = [
    { value: "search", label: "搜索" },
    { value: "songs", label: "歌曲" },
    { value: "album", label: "专辑" },
  ]

  return (
    <div className="mt-4 flex rounded-[5px] border border-[#c5c7cb] bg-[#eceef1] p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
      {items.map((item) => (
        <button
          className={`h-[30px] min-w-[70px] rounded-[4px] px-3 text-[13px] font-normal transition-colors ${
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

export default function SmartisanMusic() {
  const [view, setView] = useState<MusicView>("songs")

  return (
    <div className="flex w-full flex-col items-center px-2 py-4">
      <div
        className="w-full max-w-[380px] overflow-hidden rounded-[7px] border border-[#b9bcc1] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <div className="flex h-[640px] flex-col bg-white">
          <StatusBar />
          {view === "search" ? <SearchScreen /> : null}
          {view === "songs" ? <SongsScreen /> : null}
          {view === "album" ? <AlbumScreen /> : null}
          <BottomTabs onChange={setView} value={view} />
        </div>
      </div>
      <ViewSwitcher onChange={setView} value={view} />
    </div>
  )
}
