"use client"

import { AvatarGroup } from "@/components/data-display/dice/avatar-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Demo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">基础用法</span>
        <AvatarGroup size={40} max={4}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/rauchg.png" alt="@rauchg" />
            <AvatarFallback>RG</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>+3</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>+2</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">自定义溢出渲染</span>
        <AvatarGroup
          size={36}
          max={3}
          renderOverflow={(count) => (
            <div className="inline-flex size-9 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs ring-2 ring-background">
              +{count}
            </div>
          )}
        >
          <Avatar size="sm">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>IJ</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
    </div>
  )
}
