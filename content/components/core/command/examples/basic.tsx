import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/core/command"
export default function Cmd() {
  return (
    <Command className="w-64 rounded border">
      <CommandInput placeholder="搜索命令..." />
      <CommandList>
        <CommandGroup heading="操作">
          <CommandItem>新建文件</CommandItem>
          <CommandItem>打开文件夹</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
