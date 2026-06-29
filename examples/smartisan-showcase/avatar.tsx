import { Avatar } from "@/components/base/avatar"
import * as React from "react"

export default function SmartisanAvatarExample() {
  const src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          标准扁平头像 (Standard Flat Avatar)
        </h4>
        <div className="flex flex-wrap gap-6 items-center">
          <Avatar src={src} size="large" />
          <Avatar src={src} size="large" shape="square" />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          锤子拟物化头像 (Smartisan Skeuomorphic Avatar)
        </h4>
        <div className="flex flex-wrap gap-6 items-center">
          <Avatar variant="skeuomorphic" src={src} size="large" />
          <Avatar variant="skeuomorphic" src={src} size="large" shape="square" />
        </div>
      </div>
    </div>
  )
}
