import { Button } from "@/components/ui/button"

export default function ButtonBlockExample() {
  return (
    <div className="w-full space-y-2">
      <Button block color="primary" variant="solid">
        提交
      </Button>
      <Button block>取消</Button>
    </div>
  )
}
