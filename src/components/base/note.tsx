import * as React from "react"
import { cn } from "@/lib/utils"

export type NoteProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Title text displayed on the leather bar. @default "Smartisan Note" */
  titleText?: string
  /** Custom children for the note content. */
  children?: React.ReactNode
}

const Note = React.forwardRef<HTMLDivElement, NoteProps>(function Note(
  { className, titleText = "Smartisan Note", children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col overflow-hidden rounded border bg-[#fcfaf2] text-sm text-neutral-800 shadow-[0_4px_15px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] border-[#e6e2d3] dark:bg-[#1e1d1a] dark:text-zinc-300 dark:border-[#2d2b25] dark:shadow-[0_4px_15px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    >
      {/* 顶部皮革压条 (Leather Bar) */}
      <div className="relative flex h-10 w-full items-center justify-center bg-gradient-to-b from-[#3a2f28] to-[#261f1a] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.15)] border-b border-[#1b1411] dark:from-[#1d1714] dark:to-[#120f0d]">
        {/* 缝线效果 (Stitching) */}
        <div className="absolute inset-x-0 top-[2px] h-0 border-t border-dashed border-white/10" />
        <div className="absolute inset-x-0 bottom-[2px] h-0 border-b border-dashed border-black/30" />

        {/* 左侧两个金属铆钉 (Metallic Rivets) */}
        <div className="absolute left-4 flex items-center gap-2">
          <div className="size-2 rounded-full bg-gradient-to-tr from-neutral-500 via-neutral-300 to-white shadow-[inset_0_0.5px_0_rgba(255,255,255,0.6),0_1px_1.5px_rgba(0,0,0,0.4)]" />
          <div className="size-2 rounded-full bg-gradient-to-tr from-neutral-500 via-neutral-300 to-white shadow-[inset_0_0.5px_0_rgba(255,255,255,0.6),0_1px_1.5px_rgba(0,0,0,0.4)]" />
        </div>

        {/* 压条标题 (Title) */}
        <span className="font-serif text-xs font-bold tracking-wider text-[#d4c5b9] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] select-none">
          {titleText}
        </span>
      </div>

      {/* 信纸正文区域 (Paper Content) */}
      <div
        className="relative flex-1 p-8 font-serif leading-8"
        style={{
          backgroundImage: "linear-gradient(rgba(197,190,174,0.25) 1px, transparent 1px)",
          backgroundSize: "100% 2rem",
          backgroundPosition: "0 1.5rem",
        }}
      >
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 leading-8 text-neutral-800 dark:text-zinc-300 [&_p]:m-0 [&_p]:leading-8">
          {children}
        </div>
      </div>
    </div>
  )
})

Note.displayName = "Note"

export { Note }
