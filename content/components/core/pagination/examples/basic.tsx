import { useState } from "react"
import { Pagination } from "@/components/core/pagination"

export default function PaginationBasicExample() {
  const [current, setCurrent] = useState(3)

  return (
    <Pagination
      total={200}
      current={current}
      onChange={(page) => setCurrent(page)}
    />
  )
}
