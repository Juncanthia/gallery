import { AvatarStack } from "@/components/ui/avatar-stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AvatarStackBasicExample() {
  return (
    <AvatarStack className="w-full max-w-sm">
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
      <Avatar>
        <AvatarFallback>D</AvatarFallback>
      </Avatar>
    </AvatarStack>
  )
}
