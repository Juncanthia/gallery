import { Button } from "@/components/base/button"

export default function ButtonBasicExample() {
  return (
    <>
      <Button>Default</Button>
      <Button color="primary" variant="solid">
        Primary
      </Button>
      <Button color="danger" variant="solid">
        Danger
      </Button>
      <Button color="success" variant="solid">
        Success
      </Button>
      <Button color="warning" variant="solid">
        Warning
      </Button>
      <Button color="info" variant="solid">
        Info
      </Button>
    </>
  )
}
