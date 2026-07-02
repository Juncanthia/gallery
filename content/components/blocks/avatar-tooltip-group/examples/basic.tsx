import { AvatarGroup } from "@/components/blocks/avatar-tooltip-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/core/avatar"

export default function AvatarGroupBasicExample() {
  return (
    <AvatarGroup className="w-full max-w-sm">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="A" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  )
}
