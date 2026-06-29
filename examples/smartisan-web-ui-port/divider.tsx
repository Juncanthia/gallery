import { DemoSurface, SmDivider } from "./shared"

export default function SmartisanWebUiDividerDemo() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <DemoSurface>
        <p className="my-2">
          测试分割线
          <SmDivider>W</SmDivider>
          测试分割线
        </p>
        <p className="my-2"><SmDivider /></p>
      </DemoSurface>
    </div>
  )
}
