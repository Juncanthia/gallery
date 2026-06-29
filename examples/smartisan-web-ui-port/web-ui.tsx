import type { ButtonHTMLAttributes, ReactNode } from "react"

type SmButtonType = "normal" | "primary" | "warning" | "danger"
type SmButtonSize = "large" | "medium" | "small" | "mini"
type SmCardShadow = "always" | "hover" | "never"

type SmButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  buttonType?: SmButtonType
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
  size?: SmButtonSize
}

const buttonSizeClasses: Record<SmButtonSize, string> = {
  large: "h-[50px] w-[200px] rounded-[5px] text-[18px] font-[800]",
  medium: "h-[40px] w-[150px] rounded-[5px] text-[18px] font-[800]",
  small: "h-[30px] w-[100px] rounded-[4px] text-[12px] font-[550]",
  mini: "h-[30px] w-[70px] rounded-[3px] text-[10px] font-[450]",
}

const buttonTypeClasses: Record<SmButtonType, string> = {
  normal:
    "border border-[#d7d7d7] bg-linear-to-b from-white to-[#f6f6f6] text-[#646464] hover:from-[#f6f6f6] hover:to-[#f0f1f2] active:from-[#e3e3e3] active:to-[#f2f2f2]",
  primary:
    "bg-linear-to-b from-[#679af6] to-[#5584f4] hover:from-[#5c89e5] hover:to-[#517acb] active:from-[#4d74d5] active:to-[#6190dd]",
  warning:
    "bg-linear-to-b from-[#ffd330] to-[#ffd22d] hover:shadow-[inset_0_1px_1px_#ffeb83,inset_0_0_2px_#cab92d,inset_0_-2px_3px_#c7a236,inset_0_0_100px_rgba(199,165,34,0.6)] active:bg-[#c7a522] active:shadow-[inset_0_1px_2px_#ffeb83]",
  danger:
    "bg-linear-to-b from-[#ed8888] to-[#e26161] hover:from-[#ee9393] hover:to-[#e57272] active:from-[#e77474] active:to-[#da5050]",
}

const buttonDisabledClasses =
  "cursor-not-allowed bg-linear-to-b from-[#c2c2c2] to-[#b2b2b2] text-[#fbfbfb]"

const cardShadowClasses: Record<SmCardShadow, string> = {
  always:
    "shadow-[0_9px_30px_-6px_rgba(0,0,0,0.2),0_18px_20px_-10px_rgba(0,0,0,0.04),0_18px_20px_-10px_rgba(0,0,0,0.04),0_10px_20px_-10px_rgba(0,0,0,0.04)]",
  hover:
    "transition duration-300 hover:shadow-[0_9px_30px_-6px_rgba(0,0,0,0.2),0_18px_20px_-10px_rgba(0,0,0,0.04),0_18px_20px_-10px_rgba(0,0,0,0.04),0_10px_20px_-10px_rgba(0,0,0,0.04)] focus:shadow-[0_9px_30px_-6px_rgba(0,0,0,0.2),0_18px_20px_-10px_rgba(0,0,0,0.04),0_18px_20px_-10px_rgba(0,0,0,0.04),0_10px_20px_-10px_rgba(0,0,0,0.04)]",
  never: "shadow-none",
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function SmButton({
  buttonType = "normal",
  children,
  className,
  disabled,
  htmlType = "button",
  size = "small",
  ...props
}: SmButtonProps) {
  return (
    <button
      className={joinClasses(
        "m-[5px] inline-block cursor-pointer select-none border-0 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] outline-none",
        disabled ? buttonDisabledClasses : buttonTypeClasses[buttonType],
        buttonSizeClasses[size],
        className
      )}
      disabled={disabled}
      type={htmlType}
      {...props}
    >
      {children}
    </button>
  )
}

function SmTag({ children, text }: { children?: ReactNode; text?: string }) {
  return (
    <span className="m-[3px] inline-block h-[20px] rounded-[10px] border border-[#93b2f7] bg-[#e5efff] px-[10px] text-center text-[12px] font-[700] leading-[20px] text-[#3965cc]">
      {children ?? text}
    </span>
  )
}

function SmDivider({ children }: { children?: ReactNode }) {
  return (
    <span className="relative inline-flex items-center whitespace-nowrap text-center align-middle">
      <span className="absolute top-1/2 left-0 w-1/2 border-t border-[#232323]" />
      <span className="absolute top-1/2 right-0 w-1/2 border-t border-[#232323]" />
      <span className="relative inline-block box-border px-[24px] [writing-mode:horizontal-tb]">
        {children}
      </span>
    </span>
  )
}

function SmBreadcrumb({ children }: { children: ReactNode }) {
  return <span>{children}</span>
}

function SmBreadcrumbItem({ children }: { children: ReactNode }) {
  return <span className="text-[#757575] no-underline">{children}</span>
}

function SmCard({
  children,
  className,
  footer,
  header,
  shadow = "hover",
}: {
  children: ReactNode
  className?: string
  footer?: ReactNode
  header?: ReactNode
  shadow?: SmCardShadow
}) {
  return (
    <div
      className={joinClasses(
        "inline-block h-[100px] w-[150px] overflow-hidden border border-[#dadada] bg-white align-top",
        cardShadowClasses[shadow],
        className
      )}
    >
      {header ? <div className="relative block w-full overflow-hidden">{header}</div> : null}
      <div className="w-full">{children}</div>
      {footer ? <div className="relative block w-full overflow-hidden">{footer}</div> : null}
    </div>
  )
}

function DomDemo() {
  return (
    <div className="rounded-[4px] border border-[#e4e4e4] bg-[#fafafa] px-4 py-3 text-left shadow-[inset_0_1px_0_#fff]">
      <h1 className="my-2 text-[50px] font-[500] leading-[1.12] text-[#333333]">H1 : 这是一段H1标签文本</h1>
      <h2 className="my-2 text-[35px] font-[500] leading-[1.16] text-[#323232]">H2 : 这是一段H2标签文本</h2>
      <h3 className="my-2 text-[30px] font-[700] leading-[1.16] text-[#b5b5b5]">H3 : 这是一段H3标签文本</h3>
      <h4 className="my-2 text-[18px] font-[900] leading-[1.2] text-[#5079d9]">H4 : 这是一段H4标签文本</h4>
      <h5 className="my-2 text-[18px] font-[700] leading-[1.2] text-[#333333]">H5 : 这是一段H5标签文本</h5>
      <h6 className="my-2 text-[15px] font-[700] leading-[1.2] text-[#6e8bdd]">H6 : 这是一段H6标签文本</h6>
    </div>
  )
}

function ButtonDemo() {
  const types: SmButtonType[] = ["normal", "primary", "warning", "danger"]
  const sizes: SmButtonSize[] = ["large", "medium", "small", "mini"]

  return (
    <div>
      <p className="my-2">
        <SmButton>default</SmButton>
        {types.map((type) => (
          <SmButton buttonType={type} key={type}>
            {type}
          </SmButton>
        ))}
        <SmButton disabled>disabled</SmButton>
      </p>
      {types.map((type) => (
        <p className="my-2" key={type}>
          {sizes.map((size) => (
            <SmButton buttonType={type} key={`${type}-${size}`} size={size}>
              {size === "large"
                ? "大号按钮"
                : size === "medium"
                  ? "中号按钮"
                  : size === "small"
                    ? "默认尺寸按钮"
                    : "mini按钮"}
            </SmButton>
          ))}
        </p>
      ))}
      <p className="my-2">
        {sizes.map((size) => (
          <SmButton disabled key={`disabled-${size}`} size={size}>
            {size === "large"
              ? "大号按钮"
              : size === "medium"
                ? "中号按钮"
                : size === "small"
                  ? "默认尺寸按钮"
                  : "mini按钮"}
          </SmButton>
        ))}
      </p>
    </div>
  )
}

function CardDemo() {
  return (
    <div>
      <SmCard className="m-[5px]">仅含内容的默认卡片，默认大小为 150 x 100 px</SmCard>
      <SmCard className="m-[5px] rounded-[10px]" header={<div>header</div>}>
        包含 header 、自定义圆角边框的卡片
      </SmCard>
      <SmCard
        className="m-[5px] w-[300px] rounded-[10px] px-[10px]"
        header={(
          <div className="relative h-[40px] border-b border-[#dedede] leading-[40px]">
            <span className="mx-auto">header</span>
            <SmButton
              buttonType="primary"
              className="absolute top-0 right-0"
              size="mini"
            >
              确认
            </SmButton>
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
          <div className="h-[220px]">
            <span className="mx-auto">又一种自定义样式的卡片</span>
          </div>
        </SmCard>
      </p>
    </div>
  )
}

function TagDemo() {
  return (
    <p className="my-2">
      <SmTag>测试 Tag</SmTag>
      <SmTag text="text props 用法" />
    </p>
  )
}

function DividerDemo() {
  return (
    <div>
      <p className="my-2">
        测试分割线
        <SmDivider>W</SmDivider>
        测试分割线
      </p>
      <p className="my-2">
        <SmDivider />
      </p>
    </div>
  )
}

function BreadcrumbDemo() {
  return (
    <p className="my-2">
      <SmBreadcrumb>
        <SmBreadcrumbItem>首页</SmBreadcrumbItem>
        <span className="mx-2 text-[#b5b5b5]">/</span>
        <SmBreadcrumbItem>组件</SmBreadcrumbItem>
        <span className="mx-2 text-[#b5b5b5]">/</span>
        <SmBreadcrumbItem>Breadcrumb</SmBreadcrumbItem>
      </SmBreadcrumb>
    </p>
  )
}

export default function SmartisanWebUiPort() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <div className="mx-auto min-w-[980px] max-w-[1080px] rounded-[4px] border border-[#d9d9d9] bg-white px-8 py-7 text-center text-[#2c3e50] shadow-[0_6px_18px_rgba(0,0,0,0.08)] antialiased [font-family:Helvetica,Arial,sans-serif]">
        <h5 className="mt-5 mb-[10px] text-left text-[15px] font-[700] text-[#333]">系统样式-DOM:</h5>
        <DomDemo />
        <h5 className="mt-5 mb-[10px] text-left text-[15px] font-[700] text-[#333]">按钮-Button:</h5>
        <ButtonDemo />
        <h5 className="mt-5 mb-[10px] text-left text-[15px] font-[700] text-[#333]">卡片-Card:</h5>
        <CardDemo />
        <h5 className="mt-5 mb-[10px] text-left text-[15px] font-[700] text-[#333]">标签-Tag:</h5>
        <TagDemo />
        <h5 className="mt-5 mb-[10px] text-left text-[15px] font-[700] text-[#333]">分割线-Divider:</h5>
        <DividerDemo />
        <h5 className="mt-5 mb-[10px] text-left text-[15px] font-[700] text-[#333]">面包屑-Breadcrumb:</h5>
        <BreadcrumbDemo />
      </div>
    </div>
  )
}
