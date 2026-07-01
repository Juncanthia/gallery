import { FlowingMenu } from "@/components/ui/flowing-menu"

export default function FlowingMenuBasicExample() {
  return (
    <div className="h-64 w-full">
      <FlowingMenu
        items={[
          { link: "#", text: "Home", image: "https://picsum.photos/seed/home/200/150" },
          { link: "#", text: "About", image: "https://picsum.photos/seed/about/200/150" },
          { link: "#", text: "Contact", image: "https://picsum.photos/seed/contact/200/150" },
        ]}
      />
    </div>
  )
}
