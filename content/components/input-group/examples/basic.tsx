import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export default function InputGroupBasicExample() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <InputGroup>
        <InputGroupAddon align="inline-start">https://</InputGroupAddon>
        <input className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none" placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <input className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none" placeholder="搜索..." />
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <input className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none" placeholder="输入内容" />
        <InputGroupAddon align="inline-end">
          <Button size="small" variant="text">发送</Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
