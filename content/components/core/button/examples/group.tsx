import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/core/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/core/button-group"

export default function ButtonGroupExample() {
  return (
    <div className="space-y-4">
      <ButtonGroup>
        <Button>保存</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>草稿</ButtonGroupText>
        <Button aria-label="更多" icon={<MoreHorizontal />} />
      </ButtonGroup>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Button htmlType="submit" color="primary" variant="solid">
          提交
        </Button>
        <Button htmlType="reset">重置</Button>
      </form>
    </div>
  )
}
