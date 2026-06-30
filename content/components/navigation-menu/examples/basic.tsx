import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuBasicExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>产品</NavigationMenuTrigger>
          <NavigationMenuContent className="w-48 p-2">
            <NavigationMenuLink href="#">Web 端</NavigationMenuLink>
            <br />
            <NavigationMenuLink href="#">移动端</NavigationMenuLink>
            <br />
            <NavigationMenuLink href="#">桌面端</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>资源</NavigationMenuTrigger>
          <NavigationMenuContent className="w-48 p-2">
            <NavigationMenuLink href="#">文档</NavigationMenuLink>
            <br />
            <NavigationMenuLink href="#">API</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">定价</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
