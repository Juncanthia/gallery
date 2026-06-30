import { AnchorTooltip } from "@/components/ui/gooseui-anchor-tooltip"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <AnchorTooltip content="顶部提示信息" position="top">
        <span className="text-sm font-medium underline decoration-dotted underline-offset-4">
          悬停查看上方
        </span>
      </AnchorTooltip>
      <AnchorTooltip content="底部提示信息" position="bottom">
        <span className="text-sm font-medium underline decoration-dotted underline-offset-4">
          悬停查看下方
        </span>
      </AnchorTooltip>
      <AnchorTooltip content="左侧提示信息" position="left">
        <span className="text-sm font-medium underline decoration-dotted underline-offset-4">
          悬停查看左侧
        </span>
      </AnchorTooltip>
      <AnchorTooltip content="右侧提示信息" position="right">
        <span className="text-sm font-medium underline decoration-dotted underline-offset-4">
          悬停查看右侧
        </span>
      </AnchorTooltip>
    </div>
  )
}
