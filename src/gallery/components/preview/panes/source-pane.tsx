import { MissingSource } from "../../showcase/component/missing-source"
import { PreviewSource } from "../source"

type PreviewSourceFile = {
  library?: string
  name: string
  source: string
  missing?: boolean
  expectedPath?: string
}

type SourcePaneProps = {
  files: PreviewSourceFile[]
}

export function SourcePane({ files }: SourcePaneProps) {
  if (files.length === 0) {
    return (
      <div className="my-4 rounded border border-dashed border-border/50 p-8 text-center">
        <p className="text-muted-foreground text-sm">未提取到源文件。</p>
      </div>
    )
  }

  const isDev = import.meta.env.DEV
  const missing = isDev ? files.filter((file) => file.missing) : []
  const present = files.filter((file) => !file.missing)

  return (
    <div className="space-y-2">
      {present.length > 0 ? <PreviewSource source={present} /> : null}
      {missing.map((file) => (
        <MissingSource
          expectedPath={file.expectedPath ?? ""}
          key={`missing-${file.library ?? "local"}-${file.name}`}
          name={file.name}
        />
      ))}
    </div>
  )
}
