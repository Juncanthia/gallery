import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"

export default function ButtonGroupBasicExample() {
  return (
    <div className="space-y-4">
      <ButtonGroup>
        <Button>保存</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>草稿</ButtonGroupText>
        <Button aria-label="更多" icon={<MoreHorizontal />} />
      </ButtonGroup>

      <ButtonGroup>
        <Button size="small">复制</Button>
        <Button size="small">粘贴</Button>
        <Button size="small">剪切</Button>
      </ButtonGroup>
    </div>
  )
}
