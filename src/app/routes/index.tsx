import { createFileRoute } from "@tanstack/react-router"

import { IndexRedirect } from "../../gallery/docs/index-redirect"

export const Route = createFileRoute("/")({
  component: IndexRedirect,
})
