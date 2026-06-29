import { DemoSurface, SmTag } from "./shared"

export default function SmartisanWebUiTagDemo() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <DemoSurface>
        <p className="my-2">
          <SmTag>测试 Tag</SmTag>
          <SmTag text="text props 用法" />
        </p>
      </DemoSurface>
    </div>
  )
}
