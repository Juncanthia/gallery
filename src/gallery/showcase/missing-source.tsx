type MissingSourceProps = {
  name: string
  expectedPath: string
}

export function MissingSource({ name, expectedPath }: MissingSourceProps) {
  return (
    <div className="my-2 rounded border border-destructive/40 bg-destructive/5 p-3 text-sm">
      <p className="font-medium text-destructive">源码文件缺失（开发模式）：{name}</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{expectedPath}</p>
      <p className="mt-2 text-muted-foreground text-xs">
        请检查 ui 库导出、extract-source-files 提取规则与文件物理路径是否一致。
      </p>
    </div>
  )
}
