import { Button } from "@/components/base/button"

export default function SmartisanButtonExample() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平样式 (Standard Flat)
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button color="default" variant="solid">Default</Button>
          <Button color="primary" variant="solid">Primary</Button>
          <Button color="success" variant="solid">Success</Button>
          <Button color="warning" variant="solid">Warning</Button>
          <Button color="danger" variant="solid">Danger</Button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化样式 (Smartisan Skeuomorphic)
        </h4>
        <div className="flex flex-wrap gap-3">
          <Button color="default" variant="skeuomorphic">Default</Button>
          <Button color="primary" variant="skeuomorphic">Primary</Button>
          <Button color="success" variant="skeuomorphic">Success</Button>
          <Button color="warning" variant="skeuomorphic">Warning</Button>
          <Button color="danger" variant="skeuomorphic">Danger</Button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          不同尺寸 (Different Sizes)
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button color="primary" variant="skeuomorphic" size="small">Small</Button>
          <Button color="primary" variant="skeuomorphic" size="middle">Middle</Button>
          <Button color="primary" variant="skeuomorphic" size="large">Large</Button>
        </div>
      </div>
    </div>
  )
}
