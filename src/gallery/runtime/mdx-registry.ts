import type { ComponentType } from "react"
import type { MDXProps } from "mdx/types"

type MdxModule = {
  default: ComponentType<MDXProps>
}

const mdxPages = import.meta.glob<MdxModule>("../../../content/components/*.mdx")

export async function loadComponentMdx(slug: string) {
  const loader = mdxPages[`../../../content/components/${slug}.mdx`]

  if (!loader) {
    return null
  }

  const module = await loader()

  return module.default
}
