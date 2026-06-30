import { CardNav } from "@/components/ui/rb-card-nav"

export default function CardNavBasicExample() {
  return (
    <CardNav
      items={[
        {
          label: "Products",
          bgColor: "#3b82f6",
          textColor: "#fff",
          links: [
            { label: "Overview", href: "#" },
            { label: "Features", href: "#" },
          ],
        },
        {
          label: "Services",
          bgColor: "#10b981",
          textColor: "#fff",
          links: [
            { label: "Consulting", href: "#" },
            { label: "Development", href: "#" },
          ],
        },
        {
          label: "Company",
          bgColor: "#8b5cf6",
          textColor: "#fff",
          links: [
            { label: "About", href: "#" },
            { label: "Contact", href: "#" },
          ],
        },
      ]}
    />
  )
}
