import {
  ChevronRight,
  CircleStop,
  Heart,
  List,
  Maximize2,
  Menu,
  Minus,
  MoreHorizontal,
  Music2,
  Radio,
  Repeat2,
  Rewind,
  SkipForward,
  Star,
  UserRound,
  X,
} from "lucide-react"

type Track = {
  title: string
  artist: string
  tag?: string
}

const tracks: Track[] = [
  { title: "吻别《守岁》话剧插曲", artist: "韩红", tag: "SQ" },
  { title: "一起摇摆", artist: "好妹妹乐队", tag: "HQ" },
  { title: "一颗会开花的树", artist: "成澄庆", tag: "SQ" },
]

const albumTiles = ["#f3b08b", "#62c6d1", "#e58974"]

function WindowButton({ children, danger = false }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      className={`flex size-[30px] items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.18)] ${
        danger
          ? "bg-linear-to-b from-[#ff7c73] to-[#de463f] text-white"
          : "bg-linear-to-b from-[#ffffff] to-[#e4e6e9] text-[#94989e]"
      }`}
      type="button"
    >
      {children}
    </button>
  )
}

function BottomControls() {
  return (
    <div className="flex h-[54px] items-center border-t border-[#d9dbde] bg-linear-to-b from-[#fbfbfb] to-[#eef0f2] px-5 shadow-[inset_0_1px_0_#fff]">
      <button className="flex size-[32px] items-center justify-center rounded-full bg-[#eef0f2] text-[22px] text-[#9da1a7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" type="button">
        ‹
      </button>
      <div className="ml-auto flex items-center gap-4">
        <MoreHorizontal className="size-[22px] text-[#a4a8ad]" />
        <WindowButton>
          <Maximize2 className="size-[14px]" />
        </WindowButton>
        <WindowButton>
          <Minus className="size-[17px]" />
        </WindowButton>
        <WindowButton danger>
          <X className="size-[17px]" />
        </WindowButton>
      </div>
    </div>
  )
}

function AlbumHero() {
  return (
    <div className="mx-auto mt-4 h-[176px] w-[286px] overflow-hidden rounded-[4px] bg-[#f4a600] shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
      <div className="relative h-full w-full bg-[linear-gradient(90deg,#f7a400_0_46%,#c9c4b0_46%_100%)]">
        <div className="absolute left-4 top-10 text-[27px] font-medium leading-[30px] tracking-[-0.07em] text-white">
          EVERYTHING<br />Timberlake<br />新专辑
        </div>
        <div className="absolute right-6 top-7 h-[122px] w-[138px] bg-[linear-gradient(135deg,#e8d8b4,#6e7f87_52%,#262d31)] shadow-[0_2px_6px_rgba(0,0,0,0.28)]">
          <div className="absolute left-2 top-6 text-[55px] font-medium tracking-[-0.12em] text-[#eee2c9]">SA</div>
          <div className="absolute right-2 bottom-2 size-[44px] rounded-full bg-[#2d3336]" />
        </div>
      </div>
    </div>
  )
}

function CategoryIcons() {
  const items = [
    { icon: Heart, label: "个性推荐" },
    { icon: Radio, label: "电台" },
    { icon: Star, label: "精选集" },
    { icon: UserRound, label: "艺术家" },
  ]

  return (
    <div className="grid h-[78px] grid-cols-4 border-b border-[#e5e7ea] bg-white">
      {items.map(({ icon: Icon, label }) => (
        <button className="flex flex-col items-center justify-center gap-2 text-[12px] font-normal text-[#777e87]" key={label} type="button">
          <Icon className="size-[24px] fill-[#ee3f3f] stroke-[#ee3f3f]" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[41px] items-center justify-between border-b border-[#e6e8eb] bg-[#f6f7f8] px-4 text-[17px] font-normal text-[#555b63]">
      <span>{children}</span>
      <ChevronRight className="size-[20px] text-[#babec3]" />
    </div>
  )
}

function TrackRow({ track }: { track: Track }) {
  return (
    <div className="flex h-[58px] items-center border-b border-[#eceef0] bg-white px-4">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[16px] font-normal text-[#262b31]">{track.title}</div>
        <div className="mt-1 flex items-center gap-1 text-[12px] font-normal text-[#8d939a]">
          {track.tag ? <span className="rounded-[3px] border border-[#c07cff] px-1 text-[9px] text-[#a653df]">{track.tag}</span> : null}
          {track.artist}
        </div>
      </div>
      <MoreHorizontal className="size-[21px] text-[#999fa6]" />
    </div>
  )
}

function AlbumTiles() {
  return (
    <div className="grid grid-cols-3 gap-4 bg-white px-5 py-4">
      {albumTiles.map((color, index) => (
        <div key={color}>
          <div
            className="h-[78px] rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.18)]"
            style={{
              background: `radial-gradient(circle at 62% 35%, #fff8 0 18%, transparent 19%), linear-gradient(135deg, ${color}, #f4f4f4)`,
            }}
          />
          <div className="mt-2 truncate text-[12px] text-[#555b63]">
            {index === 0 ? "新歌速递" : index === 1 ? "午后精选" : "华语民谣"}
          </div>
        </div>
      ))}
    </div>
  )
}

function LeftPane() {
  return (
    <div className="w-[365px] shrink-0 border-r border-[#dfe1e4] bg-white">
      <div className="flex h-[58px] items-center justify-center border-b border-[#e2e4e7] bg-linear-to-b from-[#ffffff] to-[#f2f3f4] text-[22px] font-normal tracking-[-0.05em] text-[#666b72]">
        云音乐
      </div>
      <AlbumHero />
      <CategoryIcons />
      <SectionTitle>最新单曲</SectionTitle>
      {tracks.map((track) => (
        <TrackRow key={track.title} track={track} />
      ))}
      <SectionTitle>精选集</SectionTitle>
      <AlbumTiles />
    </div>
  )
}

function ProgressBar({ value = 45 }: { value?: number }) {
  return (
    <div className="relative h-[8px] rounded-full border border-[#d4d6da] bg-linear-to-b from-[#dedfe2] to-[#f8f8f9] shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
      <div className="absolute top-0 left-0 h-full rounded-full bg-linear-to-b from-[#adadb0] to-[#7e8084]" style={{ width: `${value}%` }} />
      <span className="absolute top-1/2 size-[16px] -translate-y-1/2 rounded-full border border-[#cfd1d5] bg-linear-to-b from-white to-[#ebedf0] shadow-[0_1px_3px_rgba(0,0,0,0.18)]" style={{ left: `calc(${value}% - 8px)` }} />
    </div>
  )
}

function VinylRecord() {
  return (
    <div className="relative mx-auto mt-9 h-[302px] w-[302px]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#2c3034_0_8%,#c92f31_9%_28%,#1a1a1a_29%_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.22),inset_0_0_0_2px_rgba(255,255,255,0.08)]">
        {Array.from({ length: 16 }).map((_, index) => (
          <span
            className="absolute inset-[18px] rounded-full border border-white/[0.035]"
            key={index}
            style={{ transform: `scale(${1 - index * 0.042})` }}
          />
        ))}
        <div className="absolute left-1/2 top-[86px] -translate-x-1/2 text-center text-[13px] font-medium tracking-[0.14em] text-[#ffd0d0]">
          SMARTISAN
        </div>
        <div className="absolute left-1/2 top-[134px] size-[34px] -translate-x-1/2 rounded-full bg-radial from-[#7d858e] to-[#171a1d] shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)]" />
      </div>
      <div className="absolute right-[-26px] top-[7px] h-[250px] w-[80px]">
        <div className="absolute right-[38px] top-0 h-[210px] w-[8px] rounded-full border border-[#ccd0d5] bg-linear-to-r from-[#f5f6f7] via-[#c7cbd0] to-[#ffffff] shadow-[0_2px_5px_rgba(0,0,0,0.18)]" />
        <div className="absolute right-[18px] top-[184px] h-[66px] w-[30px] rotate-[34deg] rounded-[4px] border border-[#d0d2d6] bg-linear-to-b from-[#ffffff] to-[#e6e8eb] shadow-[0_2px_4px_rgba(0,0,0,0.18)]" />
        <div className="absolute right-[24px] top-[22px] size-[38px] rounded-full border border-[#d7dade] bg-linear-to-b from-[#ffffff] to-[#e8eaed] shadow-[0_3px_8px_rgba(0,0,0,0.15)]" />
      </div>
    </div>
  )
}

function PlayerControls() {
  return (
    <div className="mt-9 flex items-center justify-center gap-5">
      <Repeat2 className="size-[25px] text-[#8f949a]" />
      <button className="flex size-[54px] items-center justify-center rounded-full border border-[#d9dce0] bg-linear-to-b from-white to-[#eef0f2] text-[#737980] shadow-[0_3px_8px_rgba(0,0,0,0.18),inset_0_1px_0_#fff]" type="button">
        <Rewind className="size-[25px] fill-[#737980]" />
      </button>
      <button className="flex size-[76px] items-center justify-center rounded-full border border-[#d8dbdf] bg-linear-to-b from-white to-[#eef0f2] text-[#6c7279] shadow-[0_4px_10px_rgba(0,0,0,0.2),inset_0_1px_0_#fff]" type="button">
        <span className="ml-1 h-0 w-0 border-y-[17px] border-l-[25px] border-y-transparent border-l-[#626870]" />
      </button>
      <button className="flex size-[54px] items-center justify-center rounded-full border border-[#d9dce0] bg-linear-to-b from-white to-[#eef0f2] text-[#737980] shadow-[0_3px_8px_rgba(0,0,0,0.18),inset_0_1px_0_#fff]" type="button">
        <SkipForward className="size-[25px] fill-[#737980]" />
      </button>
      <MoreHorizontal className="size-[28px] text-[#8f949a]" />
    </div>
  )
}

function VolumeSlider() {
  return (
    <div className="mx-auto mt-8 flex h-[38px] w-[310px] items-center rounded-[6px] border border-[#e4e6e8] bg-linear-to-b from-[#ffffff] to-[#f6f7f8] px-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="relative h-[8px] flex-1 rounded-full border border-[#d7d9dd] bg-linear-to-b from-[#dfe1e4] to-[#f8f8f9] shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]">
        <div className="absolute top-0 left-0 h-full w-[45%] rounded-full bg-linear-to-b from-[#9fa3a8] to-[#777c82]" />
        <span className="absolute left-[43%] top-1/2 h-[34px] w-[22px] -translate-y-1/2 rounded-[5px] border border-[#d5d8dc] bg-linear-to-b from-white to-[#e6e8eb] shadow-[0_2px_5px_rgba(0,0,0,0.18),inset_0_1px_0_#fff]" />
      </div>
    </div>
  )
}

function RightPane() {
  return (
    <div className="relative min-w-0 flex-1 bg-[#fbfbfb]">
      <div className="flex h-[58px] items-center border-b border-[#e0e2e5] bg-linear-to-b from-[#ffffff] to-[#f2f3f4]">
        <div className="flex-1 text-center">
          <div className="text-[18px] font-medium tracking-[-0.03em] text-[#5c6168]">我的少女时代</div>
          <div className="mt-0.5 text-[12px] font-normal text-[#8f949b]">群星</div>
        </div>
        <button className="mr-4 flex size-[42px] items-center justify-center rounded-[5px] border border-[#d2d5d9] bg-linear-to-b from-white to-[#eceef0] shadow-[inset_0_1px_0_#fff,0_1px_2px_rgba(0,0,0,0.1)]" type="button">
          <Menu className="size-[24px] text-[#777d84]" />
        </button>
      </div>
      <div className="flex h-[43px] items-center gap-3 border-b border-[#e1e3e6] bg-[#f5f6f7] px-5 text-[13px] font-normal text-[#8f949b]">
        <span>1:22</span>
        <div className="flex-1"><ProgressBar /></div>
        <span>-2:35</span>
      </div>
      <VinylRecord />
      <PlayerControls />
      <VolumeSlider />
    </div>
  )
}

function MusicWindow() {
  return (
    <div className="w-full min-w-[860px] overflow-hidden rounded-[7px] border border-[#cfd2d6] bg-white shadow-[0_22px_46px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <div className="flex h-[640px] min-h-0">
        <LeftPane />
        <RightPane />
      </div>
      <BottomControls />
    </div>
  )
}

export default function SmartisanCloudMusic() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <div
        className="mx-auto max-w-[900px] min-w-[860px]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <MusicWindow />
      </div>
    </div>
  )
}
