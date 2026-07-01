import { LogoLoop } from "@/components/ui/logo-loop"

export default function LogoLoopBasicExample() {
  return (
    <LogoLoop
      logos={[
        { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 28'%3E%3Ctext y='18' font-size='18' fill='%23888'%3ELogo 1%3C/text%3E%3C/svg%3E", alt: "Logo 1" },
        { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 28'%3E%3Ctext y='18' font-size='18' fill='%23888'%3ELogo 2%3C/text%3E%3C/svg%3E", alt: "Logo 2" },
        { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 28'%3E%3Ctext y='18' font-size='18' fill='%23888'%3ELogo 3%3C/text%3E%3C/svg%3E", alt: "Logo 3" },
        { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 28'%3E%3Ctext y='18' font-size='18' fill='%23888'%3ELogo 4%3C/text%3E%3C/svg%3E", alt: "Logo 4" },
        { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 28'%3E%3Ctext y='18' font-size='18' fill='%23888'%3ELogo 5%3C/text%3E%3C/svg%3E", alt: "Logo 5" },
      ]}
    />
  )
}
