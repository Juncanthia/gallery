import { Button } from "@/components/base/button"

export default function ButtonVariantsExample() {
  return (
    <>
      <Button color="primary" variant="solid">
        Solid
      </Button>
      <Button color="primary" variant="outlined">
        Outlined
      </Button>
      <Button color="primary" variant="dashed">
        Dashed
      </Button>
      <Button color="primary" variant="filled">
        Filled
      </Button>
      <Button color="primary" variant="text">
        Text
      </Button>
      <Button color="primary" variant="link">
        Link
      </Button>
    </>
  )
}
