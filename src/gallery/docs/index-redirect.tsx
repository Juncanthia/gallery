import { Navigate } from "@tanstack/react-router"

export function IndexRedirect() {
  return (
    <Navigate
      params={{ _splat: "button" }}
      replace
      to="/components/$"
    />
  )
}
