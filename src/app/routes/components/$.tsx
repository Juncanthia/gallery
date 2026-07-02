import { createFileRoute } from "@tanstack/react-router"

import { ComponentDocPage } from "../../docs/component-doc-page"

export const Route = createFileRoute("/components/$")({
  component: ComponentPage,
})

function ComponentPage() {
  const { _splat } = Route.useParams()

  return <ComponentDocPage slug={_splat ?? ""} />
}
