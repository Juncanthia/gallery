import {
  DialogStack,
  DialogStackTrigger,
  DialogStackOverlay,
  DialogStackBody,
  DialogStackContent,
  DialogStackHeader,
  DialogStackTitle,
  DialogStackDescription,
  DialogStackFooter,
  DialogStackNext,
  DialogStackPrevious,
} from "@/components/blocks/dialog-stack"

export default function DialogStackBasicExample() {
  return (
    <DialogStack>
      <DialogStackTrigger>Open Setup Wizard</DialogStackTrigger>
      <DialogStackOverlay />
      <DialogStackBody>
        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>Step 1: Account Info</DialogStackTitle>
            <DialogStackDescription>
              Enter your email and create a password to get started.
            </DialogStackDescription>
          </DialogStackHeader>
          <DialogStackFooter>
            <DialogStackNext>Next</DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>
        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>Step 2: Profile Setup</DialogStackTitle>
            <DialogStackDescription>
              Add your name and upload a profile photo.
            </DialogStackDescription>
          </DialogStackHeader>
          <DialogStackFooter>
            <DialogStackPrevious>Previous</DialogStackPrevious>
            <DialogStackNext>Next</DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>
        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>Step 3: Confirmation</DialogStackTitle>
            <DialogStackDescription>
              Review your settings and complete the setup.
            </DialogStackDescription>
          </DialogStackHeader>
          <DialogStackFooter>
            <DialogStackPrevious>Previous</DialogStackPrevious>
            <DialogStackNext>Finish</DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>
      </DialogStackBody>
    </DialogStack>
  )
}
