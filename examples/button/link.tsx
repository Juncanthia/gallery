import { Link } from "@tanstack/react-router"

import { Button } from "@/components/base/button"

export default function ButtonLinkExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="link" href="/components/button">
        查看文档
      </Button>
      <Button href="https://example.com" rel="noreferrer" target="_blank">
        打开外链
      </Button>
      <Button asChild color="primary" variant="solid">
        <Link to="/components/$slug" params={{ slug: "button" }}>
          路由跳转
        </Link>
      </Button>
    </div>
  )
}
