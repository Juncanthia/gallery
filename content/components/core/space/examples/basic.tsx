import { Space } from "@/components/core/space"
import { Button } from "@/components/core/button"
import { Badge } from "@/components/core/badge"

export default function SpaceBasicExample() {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">水平排列（默认）</p>
        <Space>
          <Button size="small">按钮一</Button>
          <Button size="small">按钮二</Button>
          <Badge>徽标</Badge>
        </Space>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">垂直排列 + 分隔符</p>
        <Space direction="vertical" size="small" split={<span className="text-border">|</span>}>
          <span className="text-sm">项目 A</span>
          <span className="text-sm">项目 B</span>
          <span className="text-sm">项目 C</span>
        </Space>
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">大间距</p>
        <Space size="large">
          <Button size="small">确认</Button>
          <Button size="small" variant="outlined">取消</Button>
        </Space>
      </div>
    </div>
  )
}
