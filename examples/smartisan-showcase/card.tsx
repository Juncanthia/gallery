import { Card } from "@/components/base/card"
import { Button } from "@/components/base/button"

export default function SmartisanCardExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            标准扁平卡片 (Standard Flat Card)
          </h4>
          <Card
            title="标准卡片标题"
            extra={<Button size="small">操作</Button>}
            description="这是一个标准的扁平化卡片容器，使用极细的边框和极轻的阴影，呈现出现代简约的视觉效果。"
          >
            <div className="py-2">
              卡片正文内容，支持任意 React 子元素。
            </div>
          </Card>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            锤子拟物化卡片 (Smartisan Skeuomorphic Card)
          </h4>
          <Card
            variant="skeuomorphic"
            title="拟物化卡片标题"
            extra={<Button variant="skeuomorphic" size="small">操作</Button>}
            description="这是一个复刻 Smartisan OS 经典浮雕面板的卡片，拥有自上而下的微弱拉丝渐变、精致的顶部高光以及多层漫反射阴影。"
          >
            <div className="py-2">
              卡片正文内容，支持任意 React 子元素。
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
