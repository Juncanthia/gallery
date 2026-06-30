import type { GalleryApiDoc, GalleryApiProp } from "../registry/api-types"

type ApiTableProps = {
  props: GalleryApiProp[]
}

function ApiTable({ props }: ApiTableProps) {
  if (props.length === 0) {
    return null
  }

  return (
    <div className="my-3 overflow-x-auto">
      <table className="w-full text-left text-sm border-t border-b border-border/40">
        <thead className="border-b border-border/40 bg-muted/10">
          <tr>
            <th className="px-3 py-2 text-xs font-semibold text-foreground">名称</th>
            <th className="px-3 py-2 text-xs font-semibold text-foreground">类型</th>
            <th className="px-3 py-2 text-xs font-semibold text-foreground">默认值</th>
            <th className="px-3 py-2 text-xs font-semibold text-foreground">描述</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr className="border-b border-border/40 last:border-none" key={prop.name}>
              <td className="px-3 py-2">
                <code className="rounded bg-muted/50 px-1 py-0.5 font-mono text-primary text-xs">
                  {prop.name}
                </code>
                {prop.required ? <span className="ml-1 text-[10px] text-red-500">*</span> : null}
              </td>
              <td className="px-3 py-2">
                <code className="rounded bg-muted/50 px-1 py-0.5 font-mono text-xs">
                  {prop.type}
                </code>
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {prop.defaultValue ? (
                  <code className="font-mono text-xs">{prop.defaultValue}</code>
                ) : (
                  <span className="text-xs">—</span>
                )}
              </td>
              <td className="px-3 py-2 text-muted-foreground text-xs">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type CompoundComponentTableProps = {
  components: NonNullable<GalleryApiDoc["compoundComponents"]>
}

function CompoundComponentTable({ components }: CompoundComponentTableProps) {
  if (!components || components.length === 0) {
    return null
  }

  return (
    <div className="mt-4">
      <h4 className="mb-2 font-semibold text-foreground text-xs">子组件</h4>
      <div className="my-3 overflow-x-auto">
        <table className="w-full text-left text-sm border-t border-b border-border/40">
          <thead className="border-b border-border/40 bg-muted/10">
            <tr>
              <th className="px-3 py-2 font-semibold text-foreground text-xs">名称</th>
              <th className="px-3 py-2 font-semibold text-foreground text-xs">用途</th>
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr className="border-b border-border/40 last:border-none" key={component.name}>
                <td className="px-3 py-2">
                  <code className="rounded bg-muted/50 px-1 py-0.5 font-mono text-xs">
                    {component.name}
                  </code>
                </td>
                <td className="px-3 py-2 text-muted-foreground text-xs">{component.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ApiSection({
  doc,
  missingInDev = false,
}: {
  doc: GalleryApiDoc | null
  missingInDev?: boolean
}) {
  if (!doc) {
    return (
      <div className="my-3 border border-dashed border-border/50 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          {missingInDev
            ? "API 未录入。请在 lib/catalog/api-registry.ts 补充该组件的结构化 API 文档。"
            : "暂无结构化 API，先查看 Code 和 Source。"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {doc.props.length > 0 ? (
        <div>
          <h3 className="mb-3 font-semibold text-foreground text-xs">属性 (Props)</h3>
          <ApiTable props={doc.props} />
        </div>
      ) : null}

      {doc.compoundComponents && doc.compoundComponents.length > 0 ? (
        <CompoundComponentTable components={doc.compoundComponents} />
      ) : null}

      {doc.accessibility && doc.accessibility.length > 0 ? (
        <div>
          <h3 className="mb-2 font-semibold text-foreground text-xs">无障碍</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
            {doc.accessibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
