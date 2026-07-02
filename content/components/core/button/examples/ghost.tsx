import { Button } from "@/components/core/button"

export default function ButtonGhostExample() {
  return (
    <div className="inline-flex flex-wrap gap-2 rounded bg-slate-900 p-4">
      <Button ghost color="primary" variant="solid">
        主色
      </Button>
      <Button ghost variant="outlined">
        默认
      </Button>
      <Button ghost color="danger" variant="dashed">
        危险
      </Button>
    </div>
  )
}
