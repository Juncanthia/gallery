import { Button } from "@/components/ui/button"

export default function ButtonDisabledExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button disabled>默认禁用</Button>
      <Button color="primary" disabled variant="solid">
        主色禁用
      </Button>
      <Button color="danger" disabled variant="outlined">
        危险禁用
      </Button>
      <Button disabled variant="link">
        链接禁用
      </Button>
    </div>
  )
}
