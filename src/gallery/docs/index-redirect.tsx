import { Navigate } from "@tanstack/react-router"

export function IndexRedirect() {
  return (
    <Navigate
      params={{ slug: "button" }}
      replace
      to="/components/$slug"
    />
  )
}
