import { Download } from "lucide-react"

import { Button } from "@/components/base/button"

export default function ButtonLoadingExample() {
  return (
    <>
      <Button color="primary" loading variant="solid">
        Loading
      </Button>
      <Button color="primary" loading loadingText="Submitting" variant="outlined">
        Submit
      </Button>
      <Button color="primary" icon={<Download />} variant="solid">
        Download
      </Button>
      <Button color="primary" icon={<Download />} iconPlacement="end" variant="filled">
        Export
      </Button>
    </>
  )
}
