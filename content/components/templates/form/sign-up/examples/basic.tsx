import { SignUp } from "@/components/templates/form/sign-up"

export default function Demo() {
  return (
    <div className="w-full max-w-md">
      <SignUp
        actions={{
          onSubmit: (data) => console.log("Signed up:", data),
        }}
      />
    </div>
  )
}
