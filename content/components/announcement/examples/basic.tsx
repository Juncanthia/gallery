import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/ui/announcement"

export default function AnnouncementBasicExample() {
  return (
    <Announcement className="w-full max-w-sm">
      <AnnouncementTag>New</AnnouncementTag>
      <AnnouncementTitle>v2.4.0 is now available</AnnouncementTitle>
    </Announcement>
  )
}
