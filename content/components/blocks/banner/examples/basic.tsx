import {
  Banner,
  BannerIcon,
  BannerTitle,
  BannerAction,
  BannerClose,
} from "@/components/blocks/banner"
import { BellIcon } from "lucide-react"

export default function BannerBasicExample() {
  return (
    <Banner className="w-full">
      <BannerIcon icon={BellIcon} />
      <BannerTitle>A new version of the dashboard is available.</BannerTitle>
      <BannerAction>Upgrade</BannerAction>
      <BannerClose />
    </Banner>
  )
}
