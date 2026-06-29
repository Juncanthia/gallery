import {
  Bluetooth,
  Camera,
  ChevronDown,
  CircleDot,
  Cloud,
  Download,
  Film,
  FolderDown,
  GalleryHorizontal,
  HardDrive,
  Heart,
  Image,
  Maximize2,
  Minus,
  MonitorDown,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  Video,
  X,
} from "lucide-react"
import type { ComponentType } from "react"

type AlbumItem = {
  title: string
  count: string
  icon: ComponentType<{ className?: string }>
  tone: string
  active?: boolean
  cloud?: boolean
}

type PhotoTile = {
  colors: [string, string, string]
  mark: string
  wide?: boolean
}

const albums: AlbumItem[] = [
  { title: "所有图片", count: "19k", icon: CircleDot, tone: "#9a87c9", active: true },
  { title: "相机相册", count: "213", icon: Camera, tone: "#9de21b" },
  { title: "视频", count: "126", icon: Video, tone: "#ff9640" },
  { title: "加星收藏", count: "35", icon: Star, tone: "#ffd237" },
  { title: "From Mac", count: "9999", icon: HardDrive, tone: "#a65bff", cloud: true },
  { title: "蓝牙传输", count: "1236", icon: Bluetooth, tone: "#5f8dff" },
  { title: "全景相册", count: "666", icon: GalleryHorizontal, tone: "#ffffff" },
  { title: "背景虚化相册", count: "965", icon: Image, tone: "#ffffff" },
  { title: "自拍", count: "327", icon: Camera, tone: "#8edee0" },
  { title: "连拍", count: "178", icon: Image, tone: "#d9e5ef" },
  { title: "屏幕截图", count: "568", icon: MonitorDown, tone: "#d8a0ff" },
  { title: "屏幕录像", count: "33", icon: Film, tone: "#f4f4f4" },
  { title: "下载", count: "1", icon: Download, tone: "#b9c9ff" },
  { title: "回收站", count: "1235", icon: Trash2, tone: "#ef4c42" },
]

const thirdParty: AlbumItem[] = [
  { title: "QQ", count: "19k", icon: Image, tone: "#32496b" },
  { title: "VSC0", count: "10k", icon: Image, tone: "#7bbfe8" },
]

const photoTiles: PhotoTile[] = [
  { colors: ["#90b86c", "#d09046", "#22331b"], mark: "猫" },
  { colors: ["#ececec", "#d8382a", "#5a5c61"], mark: "猫" },
  { colors: ["#d8ef5a", "#e6ac54", "#719320"], mark: "猫" },
  { colors: ["#9fbd5a", "#e1a75c", "#52683a"], mark: "猫" },
  { colors: ["#8eb65c", "#efb06a", "#38572a"], mark: "猫" },
  { colors: ["#ab8060", "#c99667", "#3f2b20"], mark: "猫" },
  { colors: ["#245016", "#d7a057", "#bfe08c"], mark: "猫" },
  { colors: ["#ae8264", "#d48d42", "#513423"], mark: "猫" },
  { colors: ["#f2f2f2", "#d58a50", "#466733"], mark: "犬" },
  { colors: ["#b8d19b", "#d89240", "#6a7f4d"], mark: "犬" },
  { colors: ["#d4b08d", "#df9255", "#5a3e2d"], mark: "猫" },
  { colors: ["#e7c59d", "#6d5244", "#d7d2ca"], mark: "猫" },
  { colors: ["#c7a77c", "#d99851", "#7d5d39"], mark: "猫" },
  { colors: ["#a58c7a", "#d5d5d5", "#3e3d3d"], mark: "猫" },
  { colors: ["#6c9c58", "#d3a36b", "#2d4a28"], mark: "犬" },
  { colors: ["#d8d8dc", "#9a9aa1", "#ffffff"], mark: "猫" },
  { colors: ["#b87a43", "#e0bb91", "#60402a"], mark: "犬" },
  { colors: ["#7b573d", "#c49c6c", "#2e2823"], mark: "犬" },
  { colors: ["#9f9f9f", "#cacaca", "#3d3d3d"], mark: "猫" },
  { colors: ["#9fbb71", "#6a6786", "#d9cf93"], mark: "猫" },
  { colors: ["#d6d0c9", "#8b898c", "#6a605b"], mark: "猫" },
  { colors: ["#d4e3ef", "#8b8f95", "#ffffff"], mark: "猫" },
  { colors: ["#8bbb70", "#87979b", "#4b683e"], mark: "猫" },
  { colors: ["#938883", "#4f4f54", "#d3d4d7"], mark: "猫" },
  { colors: ["#bd8b56", "#e0c09d", "#3c4d32"], mark: "犬" },
  { colors: ["#d7d7d7", "#f1f1f1", "#c0b7aa"], mark: "犬" },
  { colors: ["#7c9159", "#2c2f2d", "#c3d88a"], mark: "犬" },
  { colors: ["#a5c560", "#d89044", "#5b7a34"], mark: "犬" },
  { colors: ["#2e2d2b", "#d28d48", "#73421c"], mark: "猫" },
  { colors: ["#263d20", "#e9e4dc", "#b01221"], mark: "猫" },
  { colors: ["#6da84d", "#d6ad6a", "#dcefc6"], mark: "犬" },
  { colors: ["#8da24d", "#1b1c1d", "#dfcca0"], mark: "犬" },
  { colors: ["#cda260", "#efe0c4", "#8a5f35"], mark: "兔" },
  { colors: ["#4e802b", "#cf8c43", "#d8e8af"], mark: "猫" },
  { colors: ["#c8b28f", "#d99246", "#68615b"], mark: "猫" },
  { colors: ["#c3ac83", "#c27d35", "#5b4a35"], mark: "猫" },
  { colors: ["#9dbc59", "#c8945e", "#426b37"], mark: "犬" },
  { colors: ["#b3c47f", "#d0a372", "#687d58"], mark: "犬" },
  { colors: ["#a8bd5a", "#d4a16f", "#45672d"], mark: "犬" },
  { colors: ["#8dbf4b", "#e7d9b0", "#435d28"], mark: "犬" },
  { colors: ["#d7b177", "#f4f4f4", "#8b451b"], mark: "犬" },
  { colors: ["#344b22", "#ba8b55", "#9eb66b"], mark: "猫" },
  { colors: ["#cfdcc7", "#d69d67", "#965229"], mark: "猫" },
  { colors: ["#cfc9bf", "#bd7c3e", "#8b6b45"], mark: "猫" },
  { colors: ["#c0a16e", "#eee0c2", "#563d25"], mark: "兔" },
  { colors: ["#6d8d39", "#d8944a", "#dbe5b7"], mark: "犬" },
  { colors: ["#9ca94d", "#c98245", "#6f5734"], mark: "犬" },
  { colors: ["#d5d0cb", "#d49a70", "#315c80"], mark: "猫" },
]

function ToolbarButton({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`flex h-[36px] min-w-[70px] items-center justify-center border-r border-black/45 px-4 text-[15px] font-medium last:border-r-0 ${
        active
          ? "bg-linear-to-b from-[#1d1d1d] via-[#111] to-[#090909] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.13)]"
          : "bg-linear-to-b from-[#303030] via-[#242424] to-[#171717] text-[#d5d5d5]"
      }`}
      type="button"
    >
      {children}
      <ChevronDown className="ml-1 size-[12px] text-[#777]" />
    </button>
  )
}

function SearchBox() {
  return (
    <div className="flex h-[42px] items-center rounded-[19px] border border-black/60 bg-linear-to-b from-[#151515] to-[#242424] px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_1px_0_rgba(255,255,255,0.08)]">
      <Search className="mr-3 size-[21px] text-[#8b8b8b] stroke-[2.4px]" />
      <span className="text-[17px] font-normal text-[#4e4e4e]">搜索</span>
    </div>
  )
}

function SidebarIcon({ item }: { item: AlbumItem }) {
  const Icon = item.icon
  return (
    <span
      className="mr-3 flex size-[18px] items-center justify-center rounded-[5px] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.45)]"
      style={{ background: `linear-gradient(#fff8, transparent), ${item.tone}` }}
    >
      <Icon className="size-[12px] text-white drop-shadow" />
    </span>
  )
}

function AlbumRow({ item }: { item: AlbumItem }) {
  return (
    <button
      className={`flex h-[34px] w-full items-center px-4 text-left text-[15px] font-medium ${
        item.active
          ? "bg-linear-to-b from-[#3c3c3f] to-[#2a2a2c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-[#c8c8c8] hover:bg-white/5"
      }`}
      type="button"
    >
      <SidebarIcon item={item} />
      <span className="min-w-0 flex-1 truncate">{item.title}</span>
      {item.cloud ? <Cloud className="mr-3 size-[18px] text-[#575757]" /> : null}
      <span className="ml-3 text-[13px] font-medium text-[#4e4e4e]">{item.count}</span>
    </button>
  )
}

function Sidebar() {
  return (
    <aside className="flex w-[230px] shrink-0 flex-col border-r border-black bg-[#171717] shadow-[inset_-1px_0_0_rgba(255,255,255,0.04)]">
      <div className="border-b border-black/60 p-4">
        <SearchBox />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="px-4 pt-3 pb-2 text-[13px] font-medium text-[#555]">所有相册</div>
        {albums.map((item) => (
          <AlbumRow item={item} key={item.title} />
        ))}
        <div className="px-4 pt-5 pb-2 text-[13px] font-medium text-[#555]">第三方</div>
        {thirdParty.map((item) => (
          <AlbumRow item={item} key={item.title} />
        ))}
      </div>
      <div className="flex h-[56px] items-center border-t border-black bg-[#202020] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <Plus className="mr-6 size-[18px] text-white" />
        <Minus className="mr-7 size-[18px] text-white" />
        <span className="mr-auto text-[24px] leading-none text-white">···</span>
        <Settings className="size-[18px] text-white" />
      </div>
    </aside>
  )
}

function PhotoTileView({ tile, index }: { tile: PhotoTile; index: number }) {
  const [a, b, c] = tile.colors
  return (
    <div
      className="relative h-[94px] overflow-hidden border-[4px] border-black bg-cover bg-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
      style={{
        backgroundImage: `radial-gradient(circle at 68% 38%, ${b} 0 14%, transparent 15%), radial-gradient(circle at 36% 58%, ${c} 0 18%, transparent 19%), linear-gradient(135deg, ${a}, ${b} 48%, ${c})`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0_28%,rgba(0,0,0,0.16)_62%,rgba(0,0,0,0.28)_100%)]" />
      <div className="absolute right-2 bottom-1 text-[26px] font-medium text-white/55 [text-shadow:0_2px_4px_rgba(0,0,0,0.45)]">
        {tile.mark}
      </div>
      {index % 7 === 0 ? <Heart className="absolute top-2 left-2 size-[15px] fill-white/60 stroke-white/70" /> : null}
    </div>
  )
}

function PhotoGrid() {
  return (
    <div className="grid grid-cols-4 bg-black p-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
      {photoTiles.map((tile, index) => (
        <PhotoTileView index={index} key={`${tile.mark}-${index}`} tile={tile} />
      ))}
    </div>
  )
}

function PhotosWindow() {
  return (
    <div className="w-full min-w-[860px] overflow-hidden rounded-[7px] border border-black bg-[#101010] shadow-[0_22px_46px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="flex h-[58px] items-center border-b border-black bg-linear-to-b from-[#2c2c2c] via-[#202020] to-[#151515] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="w-[230px]" />
        <div className="flex flex-1 justify-center">
          <div className="flex overflow-hidden rounded-[4px] border border-black/70 shadow-[0_1px_0_rgba(255,255,255,0.08)]">
            <ToolbarButton active>时间</ToolbarButton>
            <ToolbarButton>大小</ToolbarButton>
            <ToolbarButton>名字</ToolbarButton>
          </div>
        </div>
        <button
          className="ml-auto h-[36px] min-w-[66px] rounded-[5px] border border-black/70 bg-linear-to-b from-[#2b2b2b] to-[#171717] px-4 text-[15px] font-medium text-[#d8d8d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
          type="button"
        >
          编辑
        </button>
      </div>
      <div className="flex h-[640px] min-h-0">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-hidden bg-black">
          <PhotoGrid />
        </main>
      </div>
      <div className="flex h-[58px] items-center border-t border-black bg-[#202020] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <button className="flex size-[34px] items-center justify-center rounded-full bg-[#343434] text-[22px] text-[#b8b8b8] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" type="button">
          ‹
        </button>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-[20px] text-[#9a9a9a]">···</span>
          <button className="flex size-[34px] items-center justify-center rounded-full bg-[#343434] text-[#c7c7c7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" type="button">
            <Maximize2 className="size-[15px]" />
          </button>
          <button className="flex size-[34px] items-center justify-center rounded-full bg-[#343434] text-[#c7c7c7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" type="button">
            <Minus className="size-[18px]" />
          </button>
          <button className="flex size-[34px] items-center justify-center rounded-full bg-[#e84c45] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.35)]" type="button">
            <X className="size-[18px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SmartisanPhotos() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <div
        className="mx-auto max-w-[1120px] min-w-[860px]"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <PhotosWindow />
      </div>
    </div>
  )
}
