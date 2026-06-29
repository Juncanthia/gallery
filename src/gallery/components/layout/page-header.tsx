import type { ReactNode } from "react"

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
}

export function PageHeader({ title, description, meta, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
          {meta ? <span className="text-muted-foreground text-sm">{meta}</span> : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-1.5">{actions}</div> : null}
      </div>
      {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
    </div>
  )
}
