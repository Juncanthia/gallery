"use client"


export type StarBorderProps<T extends React.ElementType = "button"> = {
  as?: T
  className?: string
  color?: string
  speed?: string
  thickness?: number
  children?: React.ReactNode
} & React.ComponentPropsWithoutRef<T>

export function StarBorder<T extends React.ElementType = "button">({
  as: Component = "button" as T,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) {
  return (
    <Component
      className={`inline-block relative rounded-[20px] overflow-hidden ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style,
      }}
      // Polymorphic `as` prop: rest props can't satisfy LibraryManagedAttributes at compile time.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic element prop spread
      {...(rest as any)}
    >
      <div
        className="absolute w-[300%] h-1/2 opacity-70 rounded-[50%] z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
          bottom: "-12px",
          right: "-250%",
          animation: "star-movement-bottom linear infinite alternate",
        }}
      />
      <div
        className="absolute w-[300%] h-1/2 opacity-70 rounded-[50%] z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
          top: "-12px",
          left: "-250%",
          animation: "star-movement-top linear infinite alternate",
        }}
      />
      <div className="relative z-[1] rounded-[20px] border border-[#222] bg-black px-[26px] py-4 text-center text-white">
        {children}
      </div>
      <style>{`
        @keyframes star-movement-bottom {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(-100%, 0%); opacity: 0; }
        }
        @keyframes star-movement-top {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(100%, 0%); opacity: 0; }
        }
      `}</style>
    </Component>
  )
}
