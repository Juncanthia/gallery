import { DemoSurface, SmButton, SmCard } from "./shared"

export default function SmartisanWebUiCardDemo() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <DemoSurface>
        <SmCard className="m-[5px]">仅含内容的默认卡片，默认大小为 150 x 100 px</SmCard>
        <SmCard className="m-[5px] rounded-[10px]" header={<div>header</div>}>
          包含 header 、自定义圆角边框的卡片
        </SmCard>
        <SmCard
          className="m-[5px] w-[300px] rounded-[10px] px-[10px]"
          header={(
            <div className="relative h-[40px] border-b border-[#dedede] leading-[40px]">
              <span className="mx-auto">header</span>
              <SmButton buttonType="primary" className="absolute top-0 right-0" size="mini">确认</SmButton>
            </div>
          )}
        >
          <div className="py-[10px] text-center">自定义 header 、大小 及 操作按钮的卡片</div>
        </SmCard>
        <p className="my-2">
          <SmCard className="m-[5px]" shadow="always">总是显示阴影</SmCard>
          <SmCard className="m-[5px]" shadow="hover">鼠标悬浮时显示阴影（默认）</SmCard>
          <SmCard className="m-[5px]" shadow="never">从不显示阴影</SmCard>
        </p>
        <p className="my-2">
          <SmCard
            className="m-[5px] h-[300px] w-[320px] rounded-[10px]"
            header={(
              <div className="h-[40px] rounded-t-[10px] border-b border-[#dedede] bg-linear-to-b from-[#f9f9f9] to-[#f4f4f4] leading-[40px] text-[#646464]">
                <span className="mx-auto">header</span>
              </div>
            )}
          >
            <div className="py-[10px] text-center text-[14px] font-[700]">另一种自定义样式的卡片</div>
          </SmCard>
          <SmCard
            className="m-[5px] h-[300px] w-[330px] rounded-[10px]"
            footer={(
              <div className="flex h-[80px] border-t border-[#dedede]">
                <div className="h-[80px] w-1/3 border-r border-[#dedede]" />
                <div className="h-[80px] w-1/3 border-r border-[#dedede]" />
                <div className="h-[80px] w-1/3" />
              </div>
            )}
          >
            <div className="h-[220px]"><span className="mx-auto">又一种自定义样式的卡片</span></div>
          </SmCard>
        </p>
      </DemoSurface>
    </div>
  )
}
