import { CursorProvider, Cursor, CursorFollow } from "@/components/ui/cursor-follow"

export default function CursorFollowBasicExample() {
  return (
    <CursorProvider className="w-full max-w-sm">
      <div className="relative flex h-32 items-center justify-center rounded border bg-muted/20 p-4">
        <p className="text-sm text-muted-foreground">移动鼠标查看光标跟随效果</p>
        <CursorFollow>
          <Cursor />
        </CursorFollow>
      </div>
    </CursorProvider>
  )
}
