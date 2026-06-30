import { Button } from "@/components/ui/button"

export default function ButtonBasicExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
    </div>
  )
}
