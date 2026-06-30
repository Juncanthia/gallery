'use client'

import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty-state'
import { Button } from '@/components/manifest/components/ui/button'
import { Inbox, Plus } from 'lucide-react'

/**
 * EmptyState 空状态页面模板组件。
 *
 * 当页面或列表无数据时，向用户展示友好的空状态提示，
 * 包含图标、标题、描述文字和可选的操作按钮。
 *
 * Features:
 * - 开箱即用的空状态布局，自带 Demo 数据
 * - 支持通过 `data` 自定义文案和操作
 * - 支持通过 `appearance` 控制显示元素
 * - 支持通过 `actions` 绑定操作回调
 * - 支持加载状态
 *
 * @component
 * @example
 * ```tsx
 * <EmptyState />
 * ```
 */

export interface EmptyStateData {
  /** 空状态图标 */
  image?: React.ReactNode
  /** 空状态标题 */
  title?: string
  /** 空状态描述 */
  description?: string
  /** 操作按钮文字 */
  actionLabel?: string
}

export interface EmptyStateActions {
  /** 点击操作按钮回调 */
  onAction?: () => void
}

export interface EmptyStateAppearance {
  /** 是否显示图标区域，默认 true */
  showImage?: boolean
  /** 是否显示操作按钮，默认 true */
  showAction?: boolean
}

export interface EmptyStateControl {
  /** 加载状态，显示骨架屏 */
  isLoading?: boolean
}

export interface EmptyStateProps {
  data?: EmptyStateData
  actions?: EmptyStateActions
  appearance?: EmptyStateAppearance
  control?: EmptyStateControl
}

function DefaultEmptyImage() {
  return (
    <div className="flex size-20 items-center justify-center rounded-full bg-muted/60">
      <Inbox className="size-10 text-muted-foreground/60" />
    </div>
  )
}

export function EmptyState({
  data,
  actions,
  appearance,
  control,
}: EmptyStateProps) {
  const isLoading = control?.isLoading ?? false
  const showImage = appearance?.showImage ?? true
  const showAction = appearance?.showAction ?? true

  const title = data?.title ?? '暂无数据'
  const description = data?.description ?? '当前没有可显示的内容，请稍后再试或创建新项目。'
  const actionLabel = data?.actionLabel ?? '创建新项目'

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-16">
        <div className="flex flex-col items-center gap-3">
          <div className="size-20 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-9 w-28 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <Empty image={data?.image ?? (showImage ? <DefaultEmptyImage /> : false)}>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {showAction ? (
        <EmptyContent>
          <Button onClick={actions?.onAction}>
            <Plus className="size-4" />
            {actionLabel}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
