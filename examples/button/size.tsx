import { Button } from "@/components/base/button"

export default function ButtonSizeExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="small">小按钮</Button>
      <Button size="middle">中按钮</Button>
      <Button size="large">大按钮</Button>
    </div>
  )
}
