import { Tag } from "@/components/base/tag"

export default function SmartisanTagExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平标签 (Standard Flat Tag)
        </h4>
        <div className="flex flex-wrap gap-3">
          <Tag color="default">Default</Tag>
          <Tag color="blue">Blue</Tag>
          <Tag color="green">Green</Tag>
          <Tag color="red">Red</Tag>
          <Tag color="orange">Orange</Tag>
          <Tag color="purple">Purple</Tag>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化标签 (Smartisan Skeuomorphic Tag)
        </h4>
        <div className="flex flex-wrap gap-3">
          <Tag color="default" variant="skeuomorphic">Default</Tag>
          <Tag color="blue" variant="skeuomorphic">Blue</Tag>
          <Tag color="green" variant="skeuomorphic">Green</Tag>
          <Tag color="red" variant="skeuomorphic">Red</Tag>
          <Tag color="orange" variant="skeuomorphic">Orange</Tag>
          <Tag color="purple" variant="skeuomorphic">Purple</Tag>
        </div>
      </div>
    </div>
  )
}
