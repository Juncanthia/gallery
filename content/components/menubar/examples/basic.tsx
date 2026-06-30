import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

export default function MenubarBasicExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>文件</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>新建</MenubarItem>
          <MenubarItem>打开</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>保存</MenubarItem>
          <MenubarItem>另存为</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>编辑</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>撤销</MenubarItem>
          <MenubarItem>重做</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>剪切</MenubarItem>
          <MenubarItem>复制</MenubarItem>
          <MenubarItem>粘贴</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>帮助</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>关于</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
