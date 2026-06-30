import * as React from "react"
import cn from "clsx"

function Field({ className, orientation, ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: string }) {
  return <div data-slot="field" className={cn("flex flex-col gap-2", className)} {...props} />
}
Field.displayName = "Field"

function FieldLabel({ className, htmlFor, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label data-slot="field-label" htmlFor={htmlFor} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
}
FieldLabel.displayName = "FieldLabel"

function FieldDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="field-description" className={cn("text-sm text-muted-foreground", className)} {...props} />
}
FieldDescription.displayName = "FieldDescription"

function FieldError({ className, children, errors, ...props }: React.HTMLAttributes<HTMLDivElement> & { errors?: Array<{ message?: string } | undefined> }) {
  return <div role="alert" data-slot="field-error" className={cn("text-sm font-medium text-destructive", className)} {...props}>{children}</div>
}
FieldError.displayName = "FieldError"

// Keep old names for backward compat
const Label = FieldLabel
const Description = FieldDescription
const ErrorMessage = FieldError

export { Field, FieldLabel, FieldDescription, FieldError, Label, Description, ErrorMessage }
