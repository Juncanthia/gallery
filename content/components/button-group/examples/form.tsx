import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupFormExample() {
  return (
    <div className="space-y-4">
      <ButtonGroup>
        <Button htmlType="submit" color="primary" variant="solid">提交</Button>
        <ButtonGroupSeparator />
        <Button htmlType="reset">重置</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical">
        <Button variant="outlined">选项一</Button>
        <Button variant="outlined">选项二</Button>
        <Button variant="outlined">选项三</Button>
      </ButtonGroup>
    </div>
  )
}
