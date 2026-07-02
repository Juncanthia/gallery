import { DecryptedText } from "@/components/effects/text/decrypted-text"

export default function DecryptedTextBasicExample() {
  return (
    <DecryptedText
      text="Hello World"
      className="text-2xl font-mono"
      animateOn="hover"
    />
  )
}
