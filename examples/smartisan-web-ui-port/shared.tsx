import type { ButtonHTMLAttributes, ReactNode } from "react"

export type SmButtonType = "normal" | "primary" | "warning" | "danger"
export type SmButtonSize = "large" | "medium" | "small" | "mini"
export type SmCardShadow = "always" | "hover" | "never"

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

export function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export function DemoSurface({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-[760px] rounded-[4px] border border-[#d9d9d9] bg-white px-8 py-7 text-center text-[#2c3e50] shadow-[0_6px_18px_rgba(0,0,0,0.08)] antialiased [font-family:Helvetica,Arial,sans-serif]">
      {children}
    </div>
  )
}

export function SmButton({
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

export function SmCard({
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

export function SmTag({ children, text }: { children?: ReactNode; text?: string }) {
  return (
    <span className="m-[3px] inline-block h-[20px] rounded-[10px] border border-[#93b2f7] bg-[#e5efff] px-[10px] text-center text-[12px] font-[700] leading-[20px] text-[#3965cc]">
      {children ?? text}
    </span>
  )
}

export function SmDivider({ children }: { children?: ReactNode }) {
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

export function SmBreadcrumb({ children }: { children: ReactNode }) {
  return <span>{children}</span>
}

export function SmBreadcrumbItem({ children }: { children: ReactNode }) {
  return <span className="text-[#757575] no-underline">{children}</span>
}
