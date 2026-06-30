import { createFileRoute } from "@tanstack/react-router"

import { ComponentDocPage } from "../../../gallery/docs/component-doc-page"

export const Route = createFileRoute("/components/$slug")({
  component: ComponentPage,
})

function ComponentPage() {
  const { slug } = Route.useParams()

  return <ComponentDocPage slug={slug} />
}
