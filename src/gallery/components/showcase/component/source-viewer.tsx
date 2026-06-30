import { getComponentSources } from "../../../runtime/source-registry"
import { SourcePane } from "../../preview/panes/source-pane"

type SourceViewerProps = {
  componentId: string
}

export function SourceViewer({ componentId }: SourceViewerProps) {
  const files = getComponentSources(componentId)

  if (files.length === 0) {
    return null
  }

  return (
    <div className="not-prose my-8 space-y-4">
      <SourcePane
        files={files.map((f) => ({
          library: "local",
          name: f.name,
          source: f.source,
        }))}
      />
    </div>
  )
}
