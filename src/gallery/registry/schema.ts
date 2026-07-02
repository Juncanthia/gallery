export type DomainCategory =
  | "effects"
  | "charts"
  | "media"
  | "editor"
  | "document"
  | "agent-tools"
  | "marketing-blocks"
  | "templates"
  | "general"
  | "layout"
  | "navigation"
  | "data-entry"
  | "data-display"
  | "feedback"
  | "blocks"
  | "ui"
  | "_internal"

export type RegistryFileRole = "source" | "style" | "helper" | "example"

export type RegistryFileEntry = {
  /** Repository-relative path, e.g. `src/components/effects/.../border-beam.tsx` */
  path: string
  role?: RegistryFileRole
  exports?: string[]
}

export type DisplayImportPath = {
  kind: "local" | "install-target"
  value: string
}

export type ComponentRegistryItem = {
  /** Unique registry id, e.g. `effects/interactions/border-beam` */
  id: string
  title: string
  titleEn: string
  category: DomainCategory
  /** Maps to `content/components/<docsSlug>/` */
  docsSlug: string
  /**
   * Short id used in legacy catalog nav entries (e.g. `border-beam`).
   * Defaults to the last segment of `id` when omitted.
   */
  catalogId?: string
  files: RegistryFileEntry[]
  /** Real import path used inside this repo; must resolve to an existing module. */
  internalImportPath: string
  /** Future shadcn registry install target; not used for in-repo imports. */
  registryTarget?: string
  /** Copy-to-clipboard display path with explicit semantics. */
  displayImportPath?: DisplayImportPath
  /** Previous `@/components/core/*` shell path, used during migration/codemod. */
  legacyShellImportPath?: string
  legacy?: {
    antd?: boolean
    migration?: number
  }
  api?: boolean
}

export type ComponentSourceFile = {
  name: string
  source: string
  role?: RegistryFileRole
}
