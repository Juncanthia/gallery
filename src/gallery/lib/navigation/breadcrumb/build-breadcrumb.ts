import { GALLERY_DOCS } from "../../../catalog"
import { PRIMARY_NAV } from "../../catalog/labels"

export type BreadcrumbSegment = {
  label: string
  href?: string
}

function titleFromSlug(slug: string): string {
  const doc = GALLERY_DOCS[slug]
  if (doc) {
    return doc.en ? `${doc.title} ${doc.en}` : doc.title
  }

  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function buildBreadcrumbSegments(pathname: string): BreadcrumbSegment[] {
  if (!pathname || pathname === "/") {
    return []
  }

  const parts = pathname.split("/").filter(Boolean)

  if (parts[0] === "components") {
    const segments: BreadcrumbSegment[] = [
      {
        label: `${PRIMARY_NAV.components.zh} ${PRIMARY_NAV.components.en}`,
        href: "/components/button",
      },
    ]

    if (parts[1]) {
      segments.push({ label: titleFromSlug(parts[1]) })
    }

    return segments
  }

  return [{ label: pathname }]
}
