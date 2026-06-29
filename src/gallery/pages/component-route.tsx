import { useParams } from "@tanstack/react-router"

import { ComponentDocPage } from "./component-doc-page"

export function ComponentRoute() {
  const params = useParams({ strict: false })
  const slug = typeof params.slug === "string" ? params.slug : "button"

  return <ComponentDocPage slug={slug} />
}
