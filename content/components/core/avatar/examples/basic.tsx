import { Avatar, AvatarFallback, AvatarImage } from "@/components/core/avatar"

export default function AvatarBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar className="size-8">
        <AvatarFallback className="text-xs">S</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarFallback className="text-lg">L</AvatarFallback>
      </Avatar>
    </div>
  )
}
