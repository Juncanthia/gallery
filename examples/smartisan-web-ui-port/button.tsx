import { DemoSurface, SmButton, type SmButtonSize, type SmButtonType } from "./shared"

const types: SmButtonType[] = ["normal", "primary", "warning", "danger"]
const sizes: SmButtonSize[] = ["large", "medium", "small", "mini"]

function labelForSize(size: SmButtonSize) {
  if (size === "large") return "大号按钮"
  if (size === "medium") return "中号按钮"
  if (size === "small") return "默认尺寸按钮"
  return "mini按钮"
}

export default function SmartisanWebUiButtonDemo() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <DemoSurface>
        <p className="my-2">
          <SmButton>default</SmButton>
          {types.map((type) => (
            <SmButton buttonType={type} key={type}>{type}</SmButton>
          ))}
          <SmButton disabled>disabled</SmButton>
        </p>
        {types.map((type) => (
          <p className="my-2" key={type}>
            {sizes.map((size) => (
              <SmButton buttonType={type} key={`${type}-${size}`} size={size}>{labelForSize(size)}</SmButton>
            ))}
          </p>
        ))}
        <p className="my-2">
          {sizes.map((size) => (
            <SmButton disabled key={`disabled-${size}`} size={size}>{labelForSize(size)}</SmButton>
          ))}
        </p>
      </DemoSurface>
    </div>
  )
}
