import { Button } from "@/components/core/button"

export default function ButtonMotionExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button color="primary" variant="solid">
        默认动效
      </Button>
      <Button color="primary" hoverScale={1} tapScale={1} variant="outlined">
        关闭动效
      </Button>
      <Button color="primary" hoverScale={1.04} tapScale={0.95} variant="filled">
        加强动效
      </Button>
    </div>
  )
}
