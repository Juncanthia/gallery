type MissingPreviewProps = {
  path: string
}

export function MissingPreview({ path }: MissingPreviewProps) {
  const expected = `examples/${path}.tsx`

  return (
    <div className="my-4 rounded border border-destructive/40 bg-destructive/5 p-4 text-sm">
      <p className="font-medium text-destructive">预览文件缺失（开发模式）</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{expected}</p>
      <p className="mt-2 text-muted-foreground text-xs">
        请检查 examples 目录、preview registry 与 MDX 中的 path 是否一致。
      </p>
    </div>
  )
}
