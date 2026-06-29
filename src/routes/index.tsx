import { createFileRoute } from "@tanstack/react-router"

import { IndexRedirect } from "../gallery/pages/index-redirect"

export const Route = createFileRoute("/")({
  component: IndexRedirect,
})
